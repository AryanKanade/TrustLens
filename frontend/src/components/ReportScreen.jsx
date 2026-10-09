import { RotateCcw, Info } from 'lucide-react';
import TrustScoreGauge from './TrustScoreGauge';
import SignalCard from './SignalCard';

const BAND_STYLES = {
  'Looks Reliable': { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' },
  'Some Concerns':  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' },
  'High Risk':      { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'Avoid':          { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200' },
};

const SIGNAL_ORDER = ['price', 'images', 'complaints', 'account', 'presence'];

export default function ReportScreen({ report, onReset }) {
  const { trustScore, band, signals } = report;

  const bandStyle = BAND_STYLES[band] || BAND_STYLES['High Risk'];

  // Count non-null signals for confidence display
  const checkedCount = SIGNAL_ORDER.filter((key) => signals[key] != null).length;

  return (
    <div className="w-full max-w-lg mx-auto">

      {/* ── Score hero ── */}
      <div className="flex flex-col items-center text-center mb-8">
        <TrustScoreGauge score={trustScore} band={band} />

        {/* Band label */}
        <span
          className={`
            inline-block mt-5 px-4 py-1.5 rounded-full text-sm font-semibold border
            ${bandStyle.bg} ${bandStyle.text} ${bandStyle.border}
          `}
        >
          {band}
        </span>

        {/* Confidence */}
        <p className="text-xs text-slate-400 mt-3">
          Based on {checkedCount} of 5 checks
        </p>
      </div>

      {/* ── Signal cards ── */}
      <div className="space-y-3">
        {SIGNAL_ORDER.map((key) => (
          <SignalCard
            key={key}
            signalKey={key}
            data={signals[key]}
          />
        ))}
      </div>

      {/* ── Disclaimer ── */}
      <div className="mt-8 flex items-start gap-2.5 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
        <Info size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-400 leading-relaxed">
          This is an automated risk estimate based on public data, not a legal
          verdict. Always verify independently before purchasing.
        </p>
      </div>

      {/* ── Reset button ── */}
      <button
        onClick={onReset}
        className="
          mt-6 w-full flex items-center justify-center gap-2
          rounded-lg bg-slate-900 px-5 py-3
          text-sm font-semibold text-white
          transition-colors duration-150
          hover:bg-slate-800
          cursor-pointer
        "
      >
        <RotateCcw size={15} />
        Check another seller
      </button>
    </div>
  );
}
