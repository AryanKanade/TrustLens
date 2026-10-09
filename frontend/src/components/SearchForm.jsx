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
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <label
        htmlFor="handle-input"
        className="block text-sm font-medium text-slate-600 mb-2"
      >
        Instagram handle
      </label>

      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 select-none pointer-events-none">
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
            py-3 pl-9 pr-4
            text-base text-slate-800 placeholder:text-slate-400
            transition-colors duration-150
            hover:border-slate-300
            focus:border-slate-400 focus:ring-0 focus:outline-none
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
          transition-colors duration-150
          hover:bg-slate-800
          disabled:opacity-50 disabled:cursor-not-allowed
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
