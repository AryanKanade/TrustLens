import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { getProfile, startInvestigation } from './api';
import SearchForm from './components/SearchForm';
import ProfileCard from './components/ProfileCard';
import PostGrid from './components/PostGrid';
import InvestigateForm from './components/InvestigateForm';
import InvestigationLoader from './components/InvestigationLoader';
import ReportScreen from './components/ReportScreen';
import './App.css';

function App() {
  const navigate = useNavigate();

  // ── Screen 1 state ────────────────────────────────────
  const [searchStatus, setSearchStatus] = useState('idle'); // idle | loading | error | success
  const [searchError, setSearchError] = useState(null);
  const [handle, setHandle] = useState('');
  const [profile, setProfile] = useState(null);

  // ── Screen 2 state ────────────────────────────────────
  const [screen, setScreen] = useState('search'); // search | postPicker | investigating | result
  const [selectedPost, setSelectedPost] = useState(null);
  const [investigateError, setInvestigateError] = useState(null);
  const [report, setReport] = useState(null);

  // ── Screen 1: look up profile ─────────────────────────
  async function handleSearch(inputHandle) {
    setSearchStatus('loading');
    setSearchError(null);
    setProfile(null);
    setHandle(inputHandle);

    try {
      const data = await getProfile(inputHandle);
      setProfile(data.profile);
      setSearchStatus('success');
      setScreen('postPicker');
    } catch (err) {
      setSearchError(
        err.message || "Couldn't find this account — check the handle and try again."
      );
      setSearchStatus('error');
    }
  }

  // ── Screen 2: run investigation ───────────────────────
  async function handleInvestigate({ askingPrice, brandName, addressQuery }) {
    setScreen('investigating');
    setInvestigateError(null);

    const imageUrl = selectedPost.serpapi_display_url || selectedPost.display_url;

    try {
      const data = await startInvestigation({
        handle,
        imageUrl,
        askingPrice,
        brandName,
        addressQuery,
      });
      setReport(data);
      setScreen('result');
    } catch (err) {
      setInvestigateError(
        err.message || 'Investigation failed — please try again.'
      );
      setScreen('postPicker'); // go back so they can retry
    }
  }

  // ── Reset to Screen 1 ────────────────────────────────
  function handleReset() {
    setSearchStatus('idle');
    setSearchError(null);
    setHandle('');
    setProfile(null);
    setScreen('search');
    setSelectedPost(null);
    setInvestigateError(null);
    setReport(null);
    navigate('/');
  }

  // ── Back to post picker from investigating error ──────
  function handleBackToSearch() {
    setScreen('search');
    setSearchStatus('idle');
    setProfile(null);
    setSelectedPost(null);
    setInvestigateError(null);
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

      {/* ═══ Main content ═══ */}
      <main className="flex-1 w-full flex flex-col items-center px-4 sm:px-6 pt-10 pb-20">

        {/* ─── Screen 1: Search ─── */}
        {screen === 'search' && (
          <div className="w-full max-w-[660px] flex flex-col items-center pt-4 sm:pt-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-4 tracking-tight">
              Is this seller legit?
            </h1>
            <p className="text-base sm:text-lg text-slate-600 text-center mb-8 sm:mb-10 max-w-[500px] leading-relaxed">
              Enter an Instagram seller's handle to check their trust signals
              before you buy.
            </p>

            <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <SearchForm onSubmit={handleSearch} isLoading={searchStatus === 'loading'} />

              {searchStatus === 'error' && (
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                  <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium text-red-700">{searchError}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── Screen 2: Post Picker ─── */}
        {screen === 'postPicker' && profile && (
          <div className="w-full max-w-[660px]">
            {/* Back link */}
            <button
              onClick={handleBackToSearch}
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} strokeWidth={2.5} />
              Back to search
            </button>

            <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              {/* Profile context */}
              <ProfileCard profile={profile} />

              {/* Investigation error (if retrying) */}
              {investigateError && (
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                  <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium text-red-700">{investigateError}</p>
                </div>
              )}

              {/* Post grid */}
              <div className="mt-8">
                <PostGrid
                  posts={profile.posts}
                  selectedPost={selectedPost}
                  onSelect={setSelectedPost}
                />
              </div>

              {/* Investigation form — appears after selecting a post */}
              {selectedPost && (
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-5 tracking-tight">
                    Tell us about the product
                  </h3>
                  <InvestigateForm
                    onSubmit={handleInvestigate}
                    isLoading={false}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── Investigating loader ─── */}
        {screen === 'investigating' && (
          <InvestigationLoader />
        )}

        {/* ─── Screen 3: Report ─── */}
        {screen === 'result' && report && (
          <ReportScreen
            report={report}
            reportId={report.id}
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

export default App;
