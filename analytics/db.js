import pg from 'pg';

let migration = null;

async function migrate(db) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS events (
      id            BIGSERIAL PRIMARY KEY,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
      type          TEXT NOT NULL,
      path          TEXT,
      label         TEXT,
      visitor_id    TEXT,
      session_id    TEXT,
      ip_hash       TEXT,
      country       TEXT,
      region        TEXT,
      city          TEXT,
      timezone      TEXT,
      device        TEXT,
      browser       TEXT,
      os            TEXT,
      referrer_host TEXT,
      language      TEXT,
      screen        TEXT,
      duration_ms   INTEGER,
      is_bot        BOOLEAN NOT NULL DEFAULT false
    );
    CREATE INDEX IF NOT EXISTS events_created_at_idx ON events (created_at);
    CREATE INDEX IF NOT EXISTS events_type_created_at_idx ON events (type, created_at);
    CREATE INDEX IF NOT EXISTS events_session_idx ON events (session_id);
    CREATE TABLE IF NOT EXISTS login_failures (
      id         BIGSERIAL PRIMARY KEY,
      ip_hash    TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS login_failures_created_at_idx ON login_failures (created_at);
  `);
}

/** Opens a connection for one request (Workers cannot keep sockets between requests) and closes it after. */
export async function withDb(env, fn) {
  const url = new URL(env.DATABASE_URL);
  // Neon adds channel_binding to its connection strings; node-postgres would send it as an unknown setting.
  url.searchParams.delete('channel_binding');
  const local = ['localhost', '127.0.0.1'].includes(url.hostname);

  const db = new pg.Client({ connectionString: url.toString(), ssl: local ? false : { rejectUnauthorized: true } });
  await db.connect();
  try {
    migration ??= migrate(db).catch((error) => {
      migration = null;
      throw error;
    });
    await migration;
    return await fn(db);
  } finally {
    await db.end().catch(() => {});
  }
}
