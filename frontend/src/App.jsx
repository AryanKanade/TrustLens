import { useState } from 'react';
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
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <ShieldCheck size={22} className="text-slate-700" />
            <span className="text-base font-semibold text-slate-900 tracking-tight">
              TrustLens
            </span>
          </button>
        </div>
      </header>

      {/* ═══ Main content ═══ */}
      <main className="flex-1 flex flex-col items-center px-6 pt-12 pb-16">

        {/* ─── Screen 1: Search ─── */}
        {screen === 'search' && (
          <div className="w-full flex flex-col items-center pt-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-2">
              Is this seller legit?
            </h1>
            <p className="text-sm sm:text-base text-slate-500 text-center mb-10 max-w-md">
              Enter an Instagram seller's handle to check their trust signals
              before you buy.
            </p>

            <SearchForm onSubmit={handleSearch} isLoading={searchStatus === 'loading'} />

            {searchStatus === 'error' && (
              <div className="mt-6 w-full max-w-md flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{searchError}</p>
              </div>
            )}
          </div>
        )}

        {/* ─── Screen 2: Post Picker ─── */}
        {screen === 'postPicker' && profile && (
          <div className="w-full max-w-lg">
            {/* Back link */}
            <button
              onClick={handleBackToSearch}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              Back to search
            </button>

            {/* Profile context */}
            <ProfileCard profile={profile} />

            {/* Investigation error (if retrying) */}
            {investigateError && (
              <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{investigateError}</p>
              </div>
            )}

            {/* Post grid */}
            <div className="mt-6">
              <PostGrid
                posts={profile.posts}
                selectedPost={selectedPost}
                onSelect={setSelectedPost}
              />
            </div>

            {/* Investigation form — appears after selecting a post */}
            {selectedPost && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-sm font-medium text-slate-700 mb-4">
                  Tell us about the product
                </p>
                <InvestigateForm
                  onSubmit={handleInvestigate}
                  isLoading={false}
                />
              </div>
            )}
          </div>
        )}

        {/* ─── Investigating loader ─── */}
        {screen === 'investigating' && (
          <InvestigationLoader />
        )}

        {/* ─── Screen 3: Report ─── */}
        {screen === 'result' && report && (
          <ReportScreen report={report} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4">
        <p className="text-xs text-slate-400 text-center">
          TrustLens — automated risk estimate based on public data, not a legal verdict.
        </p>
      </footer>
    </div>
  );
}

export default App;
