import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(connectionString || '');

export const pool = new pg.Pool({
  connectionString,
  max: 5,
  // Hosted Postgres (Neon) requires TLS; a local test database does not.
  ssl: isLocal ? false : { rejectUnauthorized: true },
});

export async function migrate() {
  await pool.query(`
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
  `);
}
