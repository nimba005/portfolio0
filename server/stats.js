import { pool } from './db.js';

const RANGES = { today: 0, '7d': 7, '30d': 30, '90d': 90, '12m': 365, all: null };
const DAY_MS = 24 * 60 * 60 * 1000;
const visitorKey = 'COALESCE(visitor_id, ip_hash)';

function safeTimeZone(tz) {
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz });
    return tz;
  } catch {
    return 'Africa/Nairobi';
  }
}

async function resolveRange(range, tz) {
  const to = new Date();
  if (range === 'today') {
    const { rows } = await pool.query(`SELECT date_trunc('day', now() AT TIME ZONE $1) AT TIME ZONE $1 AS start`, [tz]);
    return { from: rows[0].start, to, bucket: 'hour' };
  }
  if (range === 'all') {
    const { rows } = await pool.query(`SELECT min(created_at) AS first FROM events WHERE NOT is_bot`);
    return { from: rows[0].first || new Date(to.getTime() - 7 * DAY_MS), to, bucket: 'day', open: true };
  }
  return { from: new Date(to.getTime() - RANGES[range] * DAY_MS), to, bucket: 'day' };
}

async function summary(from, to) {
  const { rows } = await pool.query(
    `SELECT
       count(DISTINCT ${visitorKey})                    AS visitors,
       count(*) FILTER (WHERE type = 'pageview')        AS pageviews,
       count(DISTINCT session_id)                       AS sessions,
       count(*) FILTER (WHERE type = 'download')        AS downloads,
       count(*) FILTER (WHERE type = 'contact')         AS messages,
       (SELECT round(avg(d)) FROM (
          SELECT max(duration_ms) AS d FROM events
          WHERE type = 'engagement' AND NOT is_bot AND created_at >= $1 AND created_at < $2
          GROUP BY session_id) s)                       AS avg_duration_ms
     FROM events
     WHERE NOT is_bot AND created_at >= $1 AND created_at < $2`,
    [from, to],
  );
  const row = rows[0];
  return {
    visitors: Number(row.visitors),
    pageviews: Number(row.pageviews),
    sessions: Number(row.sessions),
    downloads: Number(row.downloads),
    messages: Number(row.messages),
    avgDurationMs: row.avg_duration_ms === null ? null : Number(row.avg_duration_ms),
  };
}

async function timeseries(from, to, bucket, tz) {
  const { rows } = await pool.query(
    `WITH buckets AS (
       SELECT generate_series(
         date_trunc($4, $1::timestamptz AT TIME ZONE $3),
         date_trunc($4, $2::timestamptz AT TIME ZONE $3),
         ('1 ' || $4)::interval) AS bucket
     ),
     counts AS (
       SELECT date_trunc($4, created_at AT TIME ZONE $3) AS bucket,
              count(DISTINCT ${visitorKey}) AS visitors,
              count(*) FILTER (WHERE type = 'pageview') AS pageviews
       FROM events
       WHERE NOT is_bot AND created_at >= $1 AND created_at < $2
       GROUP BY 1
     )
     SELECT to_char(b.bucket, 'YYYY-MM-DD"T"HH24:MI') AS t,
            COALESCE(c.visitors, 0) AS visitors,
            COALESCE(c.pageviews, 0) AS pageviews
     FROM buckets b LEFT JOIN counts c ON c.bucket = b.bucket
     ORDER BY b.bucket`,
    [from, to, tz, bucket],
  );
  return rows.map((row) => ({ t: row.t, visitors: Number(row.visitors), pageviews: Number(row.pageviews) }));
}

async function top(from, to, { select, groupBy = '1', where = 'TRUE', metric = `count(DISTINCT ${visitorKey})`, limit = 10 }) {
  const { rows } = await pool.query(
    `SELECT ${select}, ${metric} AS value
     FROM events
     WHERE NOT is_bot AND created_at >= $1 AND created_at < $2 AND ${where}
     GROUP BY ${groupBy}
     ORDER BY value DESC
     LIMIT ${limit}`,
    [from, to],
  );
  return rows.map((row) => ({ ...row, value: Number(row.value) }));
}

async function recentSessions(from, to) {
  const { rows } = await pool.query(
    `SELECT session_id,
            min(created_at) AS started_at,
            max(created_at) AS last_seen,
            max(country) AS country,
            max(city) AS city,
            max(device) AS device,
            max(browser) AS browser,
            max(os) AS os,
            max(referrer_host) FILTER (WHERE type = 'pageview') AS referrer,
            count(*) FILTER (WHERE type = 'pageview') AS pageviews,
            count(DISTINCT label) FILTER (WHERE type = 'section') AS sections,
            array_remove(array_agg(DISTINCT label) FILTER (WHERE type = 'download'), NULL) AS downloads,
            max(duration_ms) FILTER (WHERE type = 'engagement') AS duration_ms,
            bool_or(type = 'contact') AS contacted
     FROM events
     WHERE NOT is_bot AND created_at >= $1 AND created_at < $2 AND session_id IS NOT NULL
     GROUP BY session_id
     ORDER BY last_seen DESC
     LIMIT 50`,
    [from, to],
  );
  return rows.map((row) => ({
    ...row,
    pageviews: Number(row.pageviews),
    sections: Number(row.sections),
    duration_ms: row.duration_ms === null ? null : Number(row.duration_ms),
  }));
}

export async function getStats(query) {
  const range = Object.hasOwn(RANGES, query.range) ? query.range : '30d';
  const tz = safeTimeZone(query.tz || 'Africa/Nairobi');
  const { from, to, bucket, open } = await resolveRange(range, tz);
  const previousFrom = new Date(from.getTime() - (to.getTime() - from.getTime()));

  const [current, previous, series, live, bots, countries, cities, sections, downloads, outbound, referrers, devices, browsers, systems, recent] =
    await Promise.all([
      summary(from, to),
      open ? null : summary(previousFrom, from),
      timeseries(from, to, bucket, tz),
      pool.query(`SELECT count(DISTINCT ${visitorKey}) AS n FROM events WHERE NOT is_bot AND created_at > now() - interval '5 minutes'`),
      pool.query(`SELECT count(DISTINCT ${visitorKey}) AS n FROM events WHERE is_bot AND created_at >= $1 AND created_at < $2`, [from, to]),
      top(from, to, { select: 'country AS label', where: 'country IS NOT NULL' }),
      top(from, to, { select: 'city AS label, country', groupBy: '1, 2', where: "city IS NOT NULL AND city <> ''" }),
      top(from, to, { select: 'label', where: "type = 'section'", metric: 'count(DISTINCT session_id)' }),
      top(from, to, { select: 'label', where: "type = 'download'", metric: 'count(*)' }),
      top(from, to, { select: 'label', where: "type = 'outbound'", metric: 'count(*)' }),
      top(from, to, {
        select: "COALESCE(referrer_host, 'Direct') AS label",
        where: "type = 'pageview'",
        metric: 'count(DISTINCT session_id)',
      }),
      top(from, to, { select: 'device AS label', where: "type = 'pageview' AND device IS NOT NULL" }),
      top(from, to, { select: 'browser AS label', where: "type = 'pageview' AND browser IS NOT NULL" }),
      top(from, to, { select: 'os AS label', where: "type = 'pageview' AND os IS NOT NULL" }),
      recentSessions(from, to),
    ]);

  return {
    range,
    timeZone: tz,
    bucket,
    from,
    to,
    summary: current,
    previous,
    activeNow: Number(live.rows[0].n),
    botVisitors: Number(bots.rows[0].n),
    series,
    countries,
    cities,
    sections,
    downloads,
    outbound,
    referrers,
    devices,
    browsers,
    systems,
    recent,
  };
}

const CSV_COLUMNS = ['created_at', 'type', 'path', 'label', 'country', 'region', 'city', 'device', 'browser', 'os', 'referrer_host', 'language', 'screen', 'duration_ms', 'session_id'];

function csvCell(value) {
  if (value === null || value === undefined) return '';
  let text = value instanceof Date ? value.toISOString() : String(value);
  // Stop spreadsheet apps from executing cell content as a formula.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export async function exportCsv(query) {
  const range = Object.hasOwn(RANGES, query.range) ? query.range : '30d';
  const tz = safeTimeZone(query.tz || 'Africa/Nairobi');
  const { from, to } = await resolveRange(range, tz);
  const { rows } = await pool.query(
    `SELECT ${CSV_COLUMNS.join(', ')} FROM events
     WHERE NOT is_bot AND created_at >= $1 AND created_at < $2
     ORDER BY created_at DESC LIMIT 100000`,
    [from, to],
  );
  return [CSV_COLUMNS.join(','), ...rows.map((row) => CSV_COLUMNS.map((column) => csvCell(row[column])).join(','))].join('\n');
}
