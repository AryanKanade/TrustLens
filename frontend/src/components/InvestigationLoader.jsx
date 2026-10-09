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
    <div className="w-full max-w-lg mx-auto flex flex-col items-center py-20 px-6">
      <Loader2 size={32} className="text-slate-400 animate-spin mb-6" />

      <p className="text-base font-medium text-slate-700 text-center transition-opacity duration-300">
        {STEPS[stepIndex]}
      </p>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5 mt-6">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`
              h-1.5 rounded-full transition-all duration-300
              ${i <= stepIndex ? 'w-5 bg-slate-600' : 'w-1.5 bg-slate-200'}
            `}
          />
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-6 text-center">
        This usually takes 5–10 seconds
      </p>
    </div>
  );
}
