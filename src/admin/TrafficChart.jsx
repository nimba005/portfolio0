import { useEffect, useId, useRef, useState } from 'react';

const HEIGHT = 260;
const MARGIN = { top: 16, right: 16, bottom: 30, left: 44 };

// Smallest axis top with four whole-number ticks that still clears the peak.
function niceMax(value) {
  if (value <= 4) return 4;
  const magnitude = 10 ** Math.floor(Math.log10(value / 4));
  const step = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]
    .map((s) => s * magnitude)
    .find((s) => Number.isInteger(s) && s * 4 >= value);
  return step * 4;
}

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

function formatPoint(t, bucket, long = false) {
  const date = new Date(t);
  if (bucket === 'hour') return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return date.toLocaleDateString('en-GB', long ? { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' } : { day: 'numeric', month: 'short' });
}

export default function TrafficChart({ series, bucket }) {
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(720);
  const [active, setActive] = useState(null);
  const gradientId = useId();

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return undefined;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(280, entry.contentRect.width)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const innerWidth = width - MARGIN.left - MARGIN.right;
  const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
  const max = niceMax(Math.max(0, ...series.map((point) => point.visitors)));
  const x = (index) => MARGIN.left + (series.length <= 1 ? innerWidth / 2 : (index / (series.length - 1)) * innerWidth);
  const y = (value) => MARGIN.top + innerHeight - (value / max) * innerHeight;

  const line = series.map((point, index) => `${index ? 'L' : 'M'}${x(index).toFixed(1)},${y(point.visitors).toFixed(1)}`).join('');
  const area = series.length > 1 ? `${line}L${x(series.length - 1)},${y(0)}L${x(0)},${y(0)}Z` : '';
  const ticks = [0, 1, 2, 3, 4].map((step) => (max / 4) * step);
  const labelEvery = Math.max(1, Math.ceil(series.length / Math.max(2, Math.floor(innerWidth / 90))));

  const pickIndex = (clientX) => {
    const rect = wrapRef.current.getBoundingClientRect();
    const ratio = (clientX - rect.left - MARGIN.left) / innerWidth;
    return Math.min(series.length - 1, Math.max(0, Math.round(ratio * (series.length - 1))));
  };

  const onKeyDown = (event) => {
    if (!series.length) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const step = event.key === 'ArrowRight' ? 1 : -1;
      setActive((current) => Math.min(series.length - 1, Math.max(0, (current ?? series.length - 1) + step)));
    } else if (event.key === 'Escape') {
      setActive(null);
    }
  };

  const point = active !== null ? series[active] : null;
  const tooltipLeft = point ? Math.min(Math.max(x(active), 90), width - 90) : 0;
  const peak = Math.max(0, ...series.map((item) => item.visitors));

  return (
    <div className="adm-chart" ref={wrapRef}>
      <svg
        width={width}
        height={HEIGHT}
        role="img"
        tabIndex={0}
        aria-label={`Visitors per ${bucket === 'hour' ? 'hour' : 'day'}, peaking at ${peak.toLocaleString()}. Use the arrow keys to read each point.`}
        onPointerMove={(event) => series.length && setActive(pickIndex(event.clientX))}
        onPointerLeave={() => setActive(null)}
        onFocus={() => series.length && setActive(series.length - 1)}
        onBlur={() => setActive(null)}
        onKeyDown={onKeyDown}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--adm-series)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--adm-series)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {ticks.map((tick) => (
          <g key={tick}>
            <line className="adm-gridline"x1={MARGIN.left} x2={width - MARGIN.right} y1={y(tick)} y2={y(tick)} />
            <text className="adm-axis" x={MARGIN.left - 10} y={y(tick)} dy="0.32em" textAnchor="end">
              {compact.format(tick)}
            </text>
          </g>
        ))}
        {series.map((item, index) =>
          index % labelEvery === 0 || index === series.length - 1 ? (
            <text key={item.t} className="adm-axis" x={x(index)} y={HEIGHT - 8} textAnchor="middle">
              {formatPoint(item.t, bucket)}
            </text>
          ) : null,
        )}
        {area && <path d={area} fill={`url(#${gradientId})`} />}
        {series.length > 1 && <path className="adm-line" d={line} />}
        {series.length === 1 && <circle className="adm-dot" cx={x(0)} cy={y(series[0].visitors)} r="5" />}
        {point && (
          <g>
            <line className="adm-crosshair" x1={x(active)} x2={x(active)} y1={MARGIN.top} y2={y(0)} />
            <circle className="adm-dot" cx={x(active)} cy={y(point.visitors)} r="5" />
          </g>
        )}
      </svg>
      {point && (
        <div className="adm-tooltip" style={{ left: tooltipLeft }} role="status">
          <span className="adm-tooltip-date">{formatPoint(point.t, bucket, true)}</span>
          <span className="adm-tooltip-row">
            <span className="adm-tooltip-key" aria-hidden="true" />
            <strong>{point.visitors.toLocaleString()}</strong> visitors
          </span>
          <span className="adm-tooltip-row adm-tooltip-muted">
            <strong>{point.pageviews.toLocaleString()}</strong> page views
          </span>
        </div>
      )}
      <details className="adm-table-toggle">
        <summary>View as table</summary>
        <div className="adm-table-scroll">
          <table className="adm-table">
            <thead>
              <tr>
                <th scope="col">{bucket === 'hour' ? 'Hour' : 'Date'}</th>
                <th scope="col" className="num">Visitors</th>
                <th scope="col" className="num">Page views</th>
              </tr>
            </thead>
            <tbody>
              {[...series].reverse().map((item) => (
                <tr key={item.t}>
                  <td>{formatPoint(item.t, bucket, true)}</td>
                  <td className="num">{item.visitors.toLocaleString()}</td>
                  <td className="num">{item.pageviews.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
