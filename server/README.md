# Portfolio analytics API

Records visits to the portfolio and serves the protected dashboard at `/admin`.

- `POST /api/collect` receives beacons from `src/analytics.js` (page views, sections viewed, downloads, outbound clicks, contact messages, time on site).
- `POST /api/admin/login` exchanges the admin email and password for an 8-hour token.
- `GET /api/admin/stats` and `GET /api/admin/export.csv` return analytics for a date range (token required).

Visitor IP addresses are never stored: the server keeps a salted hash for counting unique visitors and resolves country and city offline with `geoip-lite`. Bots and crawlers are recorded but excluded from every report.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (Neon). Tables are created on startup. |
| `ADMIN_EMAIL` | The email used to sign in. |
| `ADMIN_PASSWORD_HASH` | Output of `npm run hash-password -- "your password"`. Never store the plain password. |
| `TOKEN_SECRET` | Random string used to sign admin sessions. |
| `IP_SALT` | Random string used when hashing visitor IPs. |
| `ALLOWED_ORIGINS` | Comma-separated site origins allowed to send visits and use the admin panel. |

Changing `ADMIN_PASSWORD_HASH` signs out every existing admin session.

## Run locally

```sh
cd server
npm install
DATABASE_URL=postgres://... ADMIN_EMAIL=... ADMIN_PASSWORD_HASH=... TOKEN_SECRET=dev IP_SALT=dev \
  ALLOWED_ORIGINS=http://localhost:5173 npm start
```

Then run the site with `VITE_ANALYTICS_URL=http://localhost:8787 npm run dev` and open `/admin`.
