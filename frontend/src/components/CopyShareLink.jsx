import { useState } from 'react';
import { Link2, Check } from 'lucide-react';

/**
 * Secondary outline button that copies the shareable report URL to clipboard.
 * Shows "Copied!" for 2 seconds after clicking.
 */
export default function CopyShareLink({ reportId }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}/report/${reportId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="
        inline-flex items-center gap-1.5
        rounded-lg border border-slate-200 bg-white shadow-sm
        px-3.5 py-2 text-xs font-semibold text-slate-600
        transition-all duration-150
        hover:border-slate-300 hover:text-slate-800
        active:scale-[0.98]
        cursor-pointer
      "
    >
      {copied ? (
        <>
          <Check size={14} className="text-green-600" strokeWidth={2.5} />
          <span className="text-green-600">Copied!</span>
        </>
      ) : (
        <>
          <Link2 size={14} strokeWidth={2.5} />
          Copy share link
        </>
      )}
    </button>
  );
}
