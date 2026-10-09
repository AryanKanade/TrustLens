import { useEffect, useRef } from 'react';

const BAND_CONFIG = {
  'Looks Reliable': { color: 'var(--color-band-green)', trackColor: '#dcfce7' },
  'Some Concerns':  { color: 'var(--color-band-amber)',  trackColor: '#fef3c7' },
  'High Risk':      { color: 'var(--color-band-orange)', trackColor: '#ffedd5' },
  'Avoid':          { color: 'var(--color-band-red)',     trackColor: '#fee2e2' },
};

/**
 * SVG circular gauge that animates from 0 to the trust score.
 * The ring color matches the risk band.
 */
export default function TrustScoreGauge({ score, band }) {
  const circleRef = useRef(null);
  const config = BAND_CONFIG[band] || BAND_CONFIG['High Risk'];

  const size = 180;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (score / 100) * circumference;

  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;

    // Start fully hidden, then animate to the target
    el.style.transition = 'none';
    el.style.strokeDashoffset = `${circumference}`;

    // Force reflow before applying the transition
    el.getBoundingClientRect();

    el.style.transition = 'stroke-dashoffset 1.2s ease-out';
    el.style.strokeDashoffset = `${targetOffset}`;
  }, [score, circumference, targetOffset]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={config.trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={config.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-5xl font-bold tabular-nums leading-none"
          style={{ color: config.color }}
        >
          {score}
        </span>
        <span className="text-xs font-medium text-slate-400 mt-1 tracking-wide uppercase">
          / 100
        </span>
      </div>
    </div>
  );
}
