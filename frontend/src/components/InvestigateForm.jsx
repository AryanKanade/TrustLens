import { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2, Search } from 'lucide-react';

export default function InvestigateForm({ onSubmit, isLoading }) {
  const [askingPrice, setAskingPrice] = useState('');
  const [brandName, setBrandName] = useState('');
  const [addressQuery, setAddressQuery] = useState('');
  const [showAddress, setShowAddress] = useState(false);

  const canSubmit = askingPrice && Number(askingPrice) > 0 && brandName.trim();

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      askingPrice: Number(askingPrice),
      brandName: brandName.trim(),
      addressQuery: addressQuery.trim() || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 mt-5">
      {/* Asking price */}
      <div>
        <label htmlFor="asking-price" className="block text-sm font-medium text-slate-600 mb-1.5">
          Asking price (₹)
        </label>
        <input
          id="asking-price"
          type="number"
          min="1"
          step="1"
          value={askingPrice}
          onChange={(e) => setAskingPrice(e.target.value)}
          placeholder="e.g. 2499"
          disabled={isLoading}
          className="
            w-full rounded-lg border border-slate-200 bg-white
            py-2.5 px-3.5 text-base text-slate-800
            placeholder:text-slate-400
            transition-colors duration-150
            hover:border-slate-300
            focus:border-slate-400 focus:ring-0 focus:outline-none
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        />
      </div>

      {/* Brand / product name */}
      <div>
        <label htmlFor="brand-name" className="block text-sm font-medium text-slate-600 mb-1.5">
          Product / brand name
        </label>
        <input
          id="brand-name"
          type="text"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="e.g. Nike Air Max Muse"
          disabled={isLoading}
          className="
            w-full rounded-lg border border-slate-200 bg-white
            py-2.5 px-3.5 text-base text-slate-800
            placeholder:text-slate-400
            transition-colors duration-150
            hover:border-slate-300
            focus:border-slate-400 focus:ring-0 focus:outline-none
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        />
        <p className="mt-1 text-xs text-slate-400">
          What would you search to find this product online?
        </p>
      </div>

      {/* Optional: Claimed address (collapsible) */}
      <div>
        <button
          type="button"
          onClick={() => setShowAddress(!showAddress)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
        >
          {showAddress ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          Claimed address
          <span className="text-slate-400">(optional)</span>
        </button>

        {showAddress && (
          <div className="mt-2">
            <input
              id="address-query"
              type="text"
              value={addressQuery}
              onChange={(e) => setAddressQuery(e.target.value)}
              placeholder="e.g. 12 MG Road, Bengaluru"
              disabled={isLoading}
              className="
                w-full rounded-lg border border-slate-200 bg-white
                py-2.5 px-3.5 text-base text-slate-800
                placeholder:text-slate-400
                transition-colors duration-150
                hover:border-slate-300
                focus:border-slate-400 focus:ring-0 focus:outline-none
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            />
            <p className="mt-1 text-xs text-slate-400">
              If the seller claims a store address, enter it to verify.
            </p>
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || !canSubmit}
        className="
          w-full flex items-center justify-center gap-2
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
            Running trust check…
          </>
        ) : (
          <>
            <Search size={16} />
            Run trust check
          </>
        )}
      </button>
    </form>
  );
}
