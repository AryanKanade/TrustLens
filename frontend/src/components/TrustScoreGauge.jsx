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

  const size = 200;
  const strokeWidth = 14;
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

    el.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
    el.style.strokeDashoffset = `${targetOffset}`;
  }, [score, circumference, targetOffset]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 drop-shadow-sm"
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
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
        <span
          className="text-6xl font-black tabular-nums leading-none tracking-tighter"
          style={{ color: config.color }}
        >
          {score}
        </span>
        <span className="text-sm font-bold text-slate-400 mt-1 tracking-widest uppercase">
          Score
        </span>
      </div>
    </div>
  );
}
