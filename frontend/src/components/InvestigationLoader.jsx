import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const STEPS = [
  'Looking up seller profile…',
  'Checking product photos…',
  'Comparing market prices…',
  'Scanning for complaints…',
  'Verifying store presence…',
  'Compiling trust report…',
];

/**
 * Animated loading overlay that cycles through investigation steps
 * to make the 5-10 second wait feel active rather than frozen.
 */
export default function InvestigationLoader() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-[660px] mx-auto">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-12 sm:p-16 shadow-sm flex flex-col items-center">
        <Loader2 size={40} className="text-slate-400 animate-spin mb-6" strokeWidth={2.5} />

        <p className="text-lg font-bold text-slate-800 text-center transition-opacity duration-300">
          {STEPS[stepIndex]}
        </p>

        {/* Progress dots */}
        <div className="flex items-center gap-2 mt-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`
                h-1.5 rounded-full transition-all duration-300
                ${i <= stepIndex ? 'w-6 bg-slate-800' : 'w-2 bg-slate-200'}
              `}
            />
          ))}
        </div>

        <p className="text-sm font-medium text-slate-500 mt-8 text-center">
          This usually takes 5–10 seconds
        </p>
      </div>
    </div>
  );
}
