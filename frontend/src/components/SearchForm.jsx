import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function SearchForm({ onSubmit, isLoading }) {
  const [handle, setHandle] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = handle.trim().replace(/^@/, '');
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label
        htmlFor="handle-input"
        className="block text-sm font-medium text-slate-700 mb-2"
      >
        Instagram handle
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 select-none pointer-events-none font-medium">
          @
        </span>
        <input
          id="handle-input"
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="e.g. urbanglow.store"
          disabled={isLoading}
          autoComplete="off"
          spellCheck="false"
          className="
            w-full rounded-lg border border-slate-200 bg-white
            py-3 pl-10 pr-4
            text-base text-slate-800 placeholder:text-slate-400
            transition-all duration-150
            hover:border-slate-300
            focus:border-slate-400 focus:ring-4 focus:ring-slate-100 focus:outline-none
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !handle.trim()}
        className="
          mt-4 w-full flex items-center justify-center gap-2
          rounded-lg bg-slate-900 px-5 py-3
          text-sm font-semibold text-white
          shadow-sm
          transition-all duration-150
          hover:bg-slate-800
          active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
          cursor-pointer
        "
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Looking up seller…
          </>
        ) : (
          <>
            <Search size={16} />
            Check this seller
          </>
        )}
      </button>
    </form>
  );
}
