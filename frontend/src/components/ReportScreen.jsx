import { RotateCcw, Info } from 'lucide-react';
import TrustScoreGauge from './TrustScoreGauge';
import SignalCard from './SignalCard';
import CopyShareLink from './CopyShareLink';

const BAND_STYLES = {
  'Looks Reliable': { bg: 'bg-green-50',  text: 'text-green-800',  border: 'border-green-200' },
  'Some Concerns':  { bg: 'bg-amber-50',  text: 'text-amber-800',  border: 'border-amber-200' },
  'High Risk':      { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' },
  'Avoid':          { bg: 'bg-red-50',    text: 'text-red-800',    border: 'border-red-200' },
};

const SIGNAL_ORDER = ['price', 'images', 'complaints', 'account', 'presence'];

/**
 * Screen 3: Trust report.
 * @param {object}   report   — report data (trustScore, band, signals, etc.)
 * @param {function} onReset  — callback to return to Screen 1
 * @param {string}   [reportId] — if present, show the "Copy share link" button
 */
export default function ReportScreen({ report, onReset, reportId }) {
  const { trustScore, band, signals } = report;

  const bandStyle = BAND_STYLES[band] || BAND_STYLES['High Risk'];

  // Count non-null signals for confidence display
  const checkedCount = SIGNAL_ORDER.filter((key) => signals[key] != null).length;

  return (
    <div className="w-full max-w-[660px] mx-auto">
      <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
        
        {/* ── Score hero ── */}
        <div className="px-6 py-10 sm:px-10 sm:py-14 border-b border-slate-100 flex flex-col items-center relative">
          
          {/* Share link (only when we have an id) */}
          {reportId && (
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
              <CopyShareLink reportId={reportId} />
            </div>
          )}

          <TrustScoreGauge score={trustScore} band={band} />

          {/* Band label */}
          <span
            className={`
              inline-block mt-8 px-5 py-2 rounded-full text-sm font-bold border tracking-wide uppercase shadow-sm
              ${bandStyle.bg} ${bandStyle.text} ${bandStyle.border}
            `}
          >
            {band}
          </span>

          {/* Confidence */}
          <p className="text-sm font-medium text-slate-500 mt-4">
            Based on {checkedCount} of 5 checks
          </p>
        </div>

        {/* ── Signal cards ── */}
        <div className="p-6 sm:p-10 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 px-1">
            Detailed Breakdown
          </h3>
          <div className="space-y-4">
            {SIGNAL_ORDER.map((key) => (
              <SignalCard
                key={key}
                signalKey={key}
                data={signals[key]}
              />
            ))}
          </div>

          {/* ── Disclaimer ── */}
          <div className="mt-8 flex items-start gap-3 rounded-xl bg-slate-100/80 border border-slate-200 px-5 py-4">
            <Info size={18} className="text-slate-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              This is an automated risk estimate based on public data, not a legal
              verdict. Always verify independently before purchasing.
            </p>
          </div>
        </div>
      </div>

      {/* ── Reset button ── */}
      <button
        onClick={onReset}
        className="
          mt-6 w-full flex items-center justify-center gap-2
          rounded-xl bg-slate-900 px-5 py-4
          text-base font-semibold text-white shadow-sm
          transition-all duration-150
          hover:bg-slate-800 active:scale-[0.98]
          cursor-pointer
        "
      >
        <RotateCcw size={18} />
        Check another seller
      </button>
    </div>
  );
}
