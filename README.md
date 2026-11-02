# Eric John Nimba Portfolio

Personal portfolio for Eric John Nimba, Full-Stack Software Engineer at AGNES, live at **https://ericnimba.dev**.

Built with React and Vite, pre-rendered to static HTML at build time for speed and search visibility, and hosted on Cloudflare Workers with static assets. A private analytics dashboard at `/admin` is powered by the Worker and Neon Postgres.

## Project structure

| Path | What it holds |
| --- | --- |
| `index.html` | Entry HTML, SEO metadata, and structured data |
| `src/App.jsx` | All portfolio content: projects, publications, skills, education, contact |
| `src/styles.css` | Portfolio styling |
| `src/analytics.js` | Visitor tracking (page views, sections, downloads, link clicks, time on site) |
| `src/admin/` | The `/admin` analytics dashboard, loaded only on that route |
| `worker/` | Cloudflare Worker: serves the API (`collect`, `admin/login`, `admin/stats`, `admin/export`); everything else is static from `dist/` |
| `analytics/` | Shared server code for the Worker: database, auth, stats |
| `public/` | Files served as-is: CV, publications, favicons, `robots.txt`, `sitemap.xml`, `_headers` |
| `assets/img/` | Images imported by the React app |
| `scripts/` | Build-time pre-rendering and the admin password hash generator |

## Run locally

```powershell
npm install
npm run dev
```

The site runs at http://localhost:5173. Tracking is off in development.

To run the analytics functions locally, build the site and use Wrangler with a `.dev.vars` file (git-ignored) holding the variables below:

```powershell
npm run build
npx wrangler dev
```

## Deployment (Cloudflare Workers)

Every push to `master` deploys automatically.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- `wrangler.toml` names the Worker, points it at `dist/`, and sets the Node compatibility flag the API needs.

Secrets, set in Cloudflare under the Worker's Settings > Variables and Secrets (type: Secret):

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string. Tables are created automatically. |
| `ADMIN_EMAIL` | Email used to sign in at `/admin`. |
| `ADMIN_PASSWORD_HASH` | Output of `npm run hash-password -- "your password"`. Never store the plain password. |
| `TOKEN_SECRET` | Random string that signs admin sessions. |
| `IP_SALT` | Random string used when hashing visitor IPs. |

Changing `ADMIN_PASSWORD_HASH` signs out every admin session.

## Privacy

Visitor IP addresses are never stored, only a salted hash used to count unique visitors. Location (country and city) comes from Cloudflare. Visitors whose browser sends Do Not Track or Global Privacy Control are not tracked, and the site owner's own browser is excluded after signing in to `/admin`. Bots and crawlers are recorded but left out of every report.

## Updating content

- Projects, publications, skills, education, and certifications: the data arrays near the top of `src/App.jsx`.
- CV: replace `public/Eric-John-Nimba-CV.pdf`, keeping the file name.
- Profile photo: replace `assets/img/passport-new.jpg` (also used for social previews from `public/assets/img/passport-new.jpg`).
- New pages or major content changes: update `public/sitemap.xml`.
