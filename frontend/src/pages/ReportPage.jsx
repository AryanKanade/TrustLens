import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2, FileX2 } from 'lucide-react';
import { getReport } from '../api';
import ReportScreen from '../components/ReportScreen';

/**
 * Standalone page for /report/:id — fetches a saved report and renders it
 * using the same ReportScreen component as the investigation flow.
 */
export default function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading'); // loading | success | notFound | error
  const [report, setReport] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchReport() {
      setStatus('loading');
      try {
        const data = await getReport(id);
        if (!cancelled) {
          setReport(data);
          setStatus('success');
        }
      } catch (err) {
        if (!cancelled) {
          if (err.message === 'REPORT_NOT_FOUND') {
            setStatus('notFound');
          } else {
            setErrorMsg(err.message || 'Failed to load report.');
            setStatus('error');
          }
        }
      }
    }

    fetchReport();
    return () => { cancelled = true; };
  }, [id]);

  function handleReset() {
    navigate('/');
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1000px] mx-auto w-full px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <ShieldCheck size={24} className="text-slate-800" strokeWidth={2.5} />
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              TrustLens
            </span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full flex flex-col items-center px-4 sm:px-6 pt-10 pb-20">

        {/* Loading */}
        {status === 'loading' && (
          <div className="w-full max-w-[660px] rounded-2xl border border-slate-200 bg-white p-16 shadow-sm flex flex-col items-center">
            <Loader2 size={36} className="text-slate-400 animate-spin mb-5" />
            <p className="text-base font-semibold text-slate-600">Loading report…</p>
          </div>
        )}

        {/* Not found */}
        {status === 'notFound' && (
          <div className="w-full max-w-[660px] rounded-2xl border border-slate-200 bg-white p-12 sm:p-16 shadow-sm flex flex-col items-center text-center">
            <FileX2 size={48} className="text-slate-300 mb-5" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
              Report not found
            </h1>
            <p className="text-base text-slate-600 mb-8 max-w-sm">
              This report may have been removed or the link may be incorrect.
            </p>
            <button
              onClick={handleReset}
              className="
                rounded-xl bg-slate-900 px-6 py-3.5
                text-base font-semibold text-white shadow-sm
                hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer
              "
            >
              Go to home page
            </button>
          </div>
        )}

        {/* Generic error */}
        {status === 'error' && (
          <div className="w-full max-w-[660px] rounded-2xl border border-slate-200 bg-white p-12 sm:p-16 shadow-sm flex flex-col items-center text-center">
            <FileX2 size={48} className="text-slate-300 mb-5" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
              Something went wrong
            </h1>
            <p className="text-base text-slate-600 mb-8 max-w-sm">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="
                rounded-xl bg-slate-900 px-6 py-3.5
                text-base font-semibold text-white shadow-sm
                hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer
              "
            >
              Go to home page
            </button>
          </div>
        )}

        {/* Success — reuse the same ReportScreen component */}
        {status === 'success' && report && (
          <ReportScreen
            report={report}
            reportId={id}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-6">
        <div className="max-w-[1000px] mx-auto px-6">
          <p className="text-sm font-medium text-slate-500 text-center">
            TrustLens — automated risk estimate based on public data, not a legal verdict.
          </p>
        </div>
      </footer>
    </div>
  );
}
