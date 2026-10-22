import { useCallback, useEffect, useState } from 'react';
import { analyticsUrl, OWNER_OPT_OUT_KEY } from '../analytics.js';
import TrafficChart from './TrafficChart.jsx';
import './admin.css';

const TOKEN_KEY = 'ejn-admin-token';
const REFRESH_MS = 60 * 1000;
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const RANGES = [
  ['today', 'Today'],
  ['7d', '7 days'],
  ['30d', '30 days'],
  ['90d', '90 days'],
  ['12m', '12 months'],
  ['all', 'All time'],
];

const SECTION_NAMES = {
  home: 'Home',
  about: 'About',
  experience: 'Experience',
  projects: 'Projects',
  publications: 'Publications',
  skills: 'Skills',
  education: 'Education',
  contact: 'Contact',
};

const DOWNLOAD_NAMES = {
  'Eric-John-Nimba-CV.pdf': 'Curriculum Vitae (CV)',
  'africa-climate-evidence-not-dashboards-eric-nimba.pdf': 'Commentary: Climate evidence, not dashboards',
  'auditable-ai-african-public-institutions-eric-nimba.pdf': 'Commentary: Auditable AI in public institutions',
};

const countryNames =new Intl.DisplayNames(['en'], { type: 'region' });
const countryName = (code) => {
  try {
    return code ? countryNames.of(code) : 'Unknown';
  } catch {
    return code;
  }
};

const numberFormat = new Intl.NumberFormat('en');
const formatNumber = (value) => numberFormat.format(value ?? 0);

function formatDuration(ms) {
  if (ms === null || ms === undefined) return '–';
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return minutes < 60 ? `${minutes}m ${seconds % 60}s` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

const relativeFormat = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
function timeAgo(value) {
  const seconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  const units = [
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return relativeFormat.format(Math.round(seconds / size), unit);
  }
  return 'just now';
}

class ApiError extends Error {
  constructor(status, message, retryAfter) {
    super(message);
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

async function api(path, { token, ...options } = {}) {
  const controller = new AbortController();
  // A sleeping free Render service can take up to a minute to wake.
  const timer = setTimeout(() => controller.abort(), 75000);
  try {
    const response = await fetch(`${analyticsUrl}${path}`, {
      ...options,
      signal: controller.signal,
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new ApiError(response.status, body.error || 'Something went wrong.', body.retryAfter);
    }
    return response;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, 'Could not reach the analytics server. Check your connection and try again.');
  } finally {
    clearTimeout(timer);
  }
}

function readToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function Flag({ code }) {
  if (!code || !/^[A-Z]{2}$/.test(code)) return <span className="adm-flag adm-flag-empty" aria-hidden="true" />;
  return (
    <img
      className="adm-flag"
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      alt=""
      width="20"
      height="15"
      loading="lazy"
    />
  );
}

function Login({ onSignedIn, notice }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(notice || '');
  const [slow, setSlow] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('submitting');
    setError('');
    const slowTimer = setTimeout(() => setSlow(true), 4000);
    try {
      const response = await api('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const { token } = await response.json();
      try {
        sessionStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(OWNER_OPT_OUT_KEY, '1');
      } catch {
        // Storage can be blocked; the session then lasts only while this tab is open.
      }
      onSignedIn(token);
    } catch (failure) {
      setPassword('');
      setError(
        failure.status === 429
          ? `Too many failed attempts. Try again in ${Math.ceil((failure.retryAfter || 900) / 60)} minutes.`
          : failure.message,
      );
      setStatus('idle');
    } finally {
      clearTimeout(slowTimer);
      setSlow(false);
    }
  };

  return (
    <div className="adm-login">
      <form className="adm-login-card" onSubmit={handleSubmit}>
        <span className="adm-login-mark material-icons" aria-hidden="true">insights</span>
        <h1>Portfolio analytics</h1>
        <p className="adm-muted">Sign in to view visits, locations, and downloads.</p>
        <label htmlFor="adm-email">Email</label>
        <input
          id="adm-email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoFocus
        />
        <label htmlFor="adm-password">Password</label>
        <div className="adm-password">
          <input
            id="adm-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button
            type="button"
            className="adm-icon-button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
          >
            <span className="material-icons" aria-hidden="true">{showPassword ? 'visibility_off' : 'visibility'}</span>
          </button>
        </div>
        {error && (
          <p className="adm-error" role="alert">
            {error}
          </p>
        )}
        {slow && (
          <p className="adm-info" role="status">
            Waking up the analytics server. This can take up to a minute after a quiet period.
          </p>
        )}
        <button className="adm-primary" type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Signing in…' : 'Sign in'}
        </button>
        <a className="adm-back" href="/">
          <span className="material-icons" aria-hidden="true">arrow_back</span>
          Back to portfolio
        </a>
      </form>
    </div>
  );
}

function Delta({ current, previous }) {
  if (previous === null || previous === undefined || current === null || current === undefined) return null;
  if (previous === 0) {
    return current > 0 ? <span className="adm-delta adm-delta-up">New this period</span> : null;
  }
  const change = Math.round(((current - previous) / previous) * 100);
  if (change === 0) return <span className="adm-delta">No change vs previous</span>;
  const up = change > 0;
  return (
    <span className={`adm-delta ${up ? 'adm-delta-up' : 'adm-delta-down'}`}>
      <span className="material-icons" aria-hidden="true">{up ? 'trending_up' : 'trending_down'}</span>
      {up ? '+' : ''}
      {change}% vs previous
    </span>
  );
}

function StatTile({ icon, label, value, display, previous }) {
  return (
    <article className="adm-tile">
      <span className="adm-tile-label">
        <span className="material-icons" aria-hidden="true">{icon}</span>
        {label}
      </span>
      <strong className="adm-tile-value">{display ?? formatNumber(value)}</strong>
      <Delta current={value} previous={previous} />
    </article>
  );
}

function BarList({ title, icon, rows, unit, empty = 'No data in this period yet.', renderLabel }) {
  const max = Math.max(1, ...rows.map((row) => row.value));
  return (
    <section className="adm-panel">
      <header className="adm-panel-head">
        <h2>
          <span className="material-icons" aria-hidden="true">{icon}</span>
          {title}
        </h2>
        <span className="adm-panel-unit">{unit}</span>
      </header>
      {rows.length === 0 ? (
        <p className="adm-empty">{empty}</p>
      ) : (
        <ol className="adm-bars">
          {rows.map((row) => (
            <li key={`${row.label}-${row.country || ''}`} title={`${row.label}: ${formatNumber(row.value)} ${unit}`}>
              <div className="adm-bar-line">
                <span className="adm-bar-label">{renderLabel ? renderLabel(row) : row.label}</span>
                <span className="adm-bar-value">{formatNumber(row.value)}</span>
              </div>
              <span className="adm-bar-track">
                <span className="adm-bar-fill" style={{ width: `${(row.value / max) * 100}%` }} />
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

const deviceIcon = { Mobile: 'smartphone', Tablet: 'tablet', Desktop: 'computer' };

function RecentVisits({ rows }) {
  return (
    <section className="adm-panel adm-panel-wide">
      <header className="adm-panel-head">
        <h2>
          <span className="material-icons" aria-hidden="true">history</span>
          Recent visits
        </h2>
        <span className="adm-panel-unit">Latest 50 sessions</span>
      </header>
      {rows.length === 0 ? (
        <p className="adm-empty">No visits recorded in this period yet.</p>
      ) : (
        <div className="adm-table-scroll">
          <table className="adm-table adm-visits">
            <thead>
              <tr>
                <th scope="col">When</th>
                <th scope="col">Location</th>
                <th scope="col">Device</th>
                <th scope="col">Source</th>
                <th scope="col">Activity</th>
                <th scope="col" className="num">Time on site</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.session_id}>
                  <td title={new Date(row.started_at).toLocaleString()}>{timeAgo(row.last_seen)}</td>
                  <td>
                    <span className="adm-cell-inline">
                      <Flag code={row.country} />
                      {[row.city, countryName(row.country)].filter(Boolean).join(', ') || 'Unknown'}
                    </span>
                  </td>
                  <td>
                    <span className="adm-cell-inline">
                      <span className="material-icons adm-cell-icon" aria-hidden="true">{deviceIcon[row.device] || 'devices'}</span>
                      {row.browser} · {row.os}
                    </span>
                  </td>
                  <td>{row.referrer || 'Direct'}</td>
                  <td>
                    <span className="adm-activity">
                      <span>{row.sections} sections</span>
                      {row.downloads?.length > 0 && (
                        <span className="adm-badge" title={row.downloads.map((file) => DOWNLOAD_NAMES[file] || file).join(', ')}>
                          <span className="material-icons" aria-hidden="true">download</span>
                          {row.downloads.length} download{row.downloads.length > 1 ? 's' : ''}
                        </span>
                      )}
                      {row.contacted && (
                        <span className="adm-badge">
                          <span className="material-icons" aria-hidden="true">mail</span>
                          Messaged
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="num">{formatDuration(row.duration_ms)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Dashboard({ token, onSignOut }) {
  const [range, setRange] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api(`/api/admin/stats?range=${range}&tz=${encodeURIComponent(timeZone)}`, { token });
      setData(await response.json());
      setError('');
    } catch (failure) {
      if (failure.status === 401) onSignOut('Your session has expired. Please sign in again.');
      else setError(failure.message);
    } finally {
      setLoading(false);
    }
  }, [range, token, onSignOut]);

  useEffect(() => {
    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => clearInterval(timer);
  }, [load]);

  const exportCsv = async () => {
    setExporting(true);
    try {
      const response = await api(`/api/admin/export.csv?range=${range}&tz=${encodeURIComponent(timeZone)}`, { token });
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = url;
      link.download = `portfolio-visits-${range}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setExporting(false);
    }
  };

  const summary = data?.summary;
  const previous = data?.previous;

  return (
    <div className="adm-dashboard">
      <header className="adm-topbar">
        <div className="adm-brand">
          <span className="material-icons" aria-hidden="true">insights</span>
          <div>
            <strong>Portfolio analytics</strong>
            <span>Eric John Nimba</span>
          </div>
        </div>
        <div className="adm-topbar-actions">
          {data && (
            <span className="adm-live" title="Visitors active in the last 5 minutes">
              <span className="adm-live-dot" aria-hidden="true" />
              {formatNumber(data.activeNow)} active now
            </span>
          )}
          <button className="adm-ghost" type="button" onClick={load} disabled={loading}>
            <span className="material-icons" aria-hidden="true">refresh</span>
            <span className="adm-hide-sm">Refresh</span>
          </button>
          <button className="adm-ghost" type="button" onClick={exportCsv} disabled={exporting}>
            <span className="material-icons" aria-hidden="true">download</span>
            <span className="adm-hide-sm">{exporting ? 'Exporting…' : 'Export CSV'}</span>
          </button>
          <button className="adm-ghost" type="button" onClick={() => onSignOut()}>
            <span className="material-icons" aria-hidden="true">logout</span>
            <span className="adm-hide-sm">Sign out</span>
          </button>
        </div>
      </header>

      <main className="adm-main">
        <div className="adm-filters" role="group" aria-label="Date range">
          {RANGES.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={range === value ? 'active' : ''}
              aria-pressed={range === value}
              onClick={() => setRange(value)}
            >
              {label}
            </button>
          ))}
          {data && data.botVisitors > 0 && (
            <span className="adm-filter-note">
              {formatNumber(data.botVisitors)} {data.botVisitors === 1 ? 'bot or crawler' : 'bots and crawlers'} excluded
            </span>
          )}
        </div>

        {error && (
          <p className="adm-error adm-error-bar" role="alert">
            {error}
          </p>
        )}

        {!data ? (
          <p className="adm-loading" role="status">
            <span className="adm-spinner" aria-hidden="true" />
            Loading analytics… the server may take up to a minute to wake.
          </p>
        ) : (
          <div className={`adm-content ${loading ? 'is-refreshing' : ''}`} aria-busy={loading}>
            <div className="adm-tiles">
              <StatTile icon="group" label="Visitors" value={summary.visitors} previous={previous?.visitors} />
              <StatTile icon="visibility" label="Page views" value={summary.pageviews} previous={previous?.pageviews} />
              <StatTile
                icon="schedule"
                label="Avg. time on site"
                value={summary.avgDurationMs}
                display={formatDuration(summary.avgDurationMs)}
                previous={previous?.avgDurationMs}
              />
              <StatTile icon="download" label="Downloads" value={summary.downloads} previous={previous?.downloads} />
              <StatTile icon="mail" label="Contact messages" value={summary.messages} previous={previous?.messages} />
            </div>

            <section className="adm-panel adm-panel-wide">
              <header className="adm-panel-head">
                <h2>
                  <span className="material-icons" aria-hidden="true">show_chart</span>
                  Visitors
                </h2>
                <span className="adm-panel-unit">per {data.bucket}</span>
              </header>
              <TrafficChart series={data.series} bucket={data.bucket} />
            </section>

            <div className="adm-grid">
              <BarList
                title="Countries"
                icon="public"
                unit="visitors"
                rows={data.countries}
                renderLabel={(row) => (
                  <span className="adm-cell-inline">
                    <Flag code={row.label} />
                    {countryName(row.label)}
                  </span>
                )}
              />
              <BarList
                title="Cities"
                icon="location_city"
                unit="visitors"
                rows={data.cities}
                renderLabel={(row) => (
                  <span className="adm-cell-inline">
                    <Flag code={row.country} />
                    {row.label}
                  </span>
                )}
              />
              <BarList
                title="Sections viewed"
                icon="view_agenda"
                unit="sessions"
                rows={data.sections}
                renderLabel={(row) => SECTION_NAMES[row.label] || row.label}
              />
              <BarList
                title="Downloads"
                icon="download"
                unit="downloads"
                rows={data.downloads}
                empty="No downloads in this period yet."
                renderLabel={(row) => DOWNLOAD_NAMES[row.label] || row.label}
              />
              <BarList title="Project & link clicks" icon="ads_click" unit="clicks" rows={data.outbound} empty="No outbound clicks in this period yet." />
              <BarList title="Traffic sources" icon="travel_explore" unit="sessions" rows={data.referrers} />
              <BarList title="Devices" icon="devices" unit="visitors" rows={data.devices} />
              <BarList title="Browsers" icon="language" unit="visitors" rows={data.browsers} />
              <BarList title="Operating systems" icon="memory" unit="visitors" rows={data.systems} />
            </div>

            <RecentVisits rows={data.recent} />
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminApp() {
  const [token, setToken] = useState(readToken);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    document.title = 'Analytics · Eric John Nimba';
  }, []);

  const signOut = useCallback((message = '') => {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      // Nothing stored.
    }
    setNotice(message);
    setToken(null);
  }, []);

  if (!analyticsUrl) {
    return (
      <div className="admin-shell">
        <div className="adm-login">
          <div className="adm-login-card">
            <h1>Analytics not configured</h1>
            <p className="adm-muted">Set VITE_ANALYTICS_URL for the site build and redeploy.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      {token ? <Dashboard token={token} onSignOut={signOut} /> : <Login onSignedIn={setToken} notice={notice} />}
    </div>
  );
}
