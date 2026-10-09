import {
  DollarSign,
  Camera,
  MessageSquareWarning,
  UserRoundCheck,
  Store,
  Minus,
} from 'lucide-react';

/**
 * Map each signal key to its display config.
 */
const SIGNAL_META = {
  price: {
    label: 'Price Fairness',
    icon: DollarSign,
  },
  images: {
    label: 'Photo Originality',
    icon: Camera,
  },
  complaints: {
    label: 'Complaints',
    icon: MessageSquareWarning,
  },
  account: {
    label: 'Account Health',
    icon: UserRoundCheck,
  },
  presence: {
    label: 'Store Presence',
    icon: Store,
  },
};

/**
 * Build a human-readable explanation from the signal's data.
 */
function getExplanation(key, data) {
  if (!data) return null;

  switch (key) {
    case 'price': {
      const { median, ratio } = data;
      const medianStr = median != null ? `₹${median.toLocaleString()}` : 'unknown';
      if (ratio != null && median != null) {
        if (ratio < 0.4) {
          return `Market median is ${medianStr} — asking price is far below typical pricing, a common bait-pricing red flag.`;
        }
        if (ratio < 0.7) {
          return `Market median is ${medianStr} — asking price is noticeably below the typical range.`;
        }
        if (ratio <= 1.3) {
          return `Market median is ${medianStr} — asking price is within the typical range.`;
        }
        return `Market median is ${medianStr} — asking price is above the typical range.`;
      }
      if (median != null) {
        return `Market median is ${medianStr}.`;
      }
      return `Price comparison data was limited.`;
    }

    case 'images': {
      const { dropshipMatchCount, totalMatches } = data;
      if (totalMatches === 0) {
        return 'No matching product photos found elsewhere online — likely original.';
      }
      const parts = [`Found ${totalMatches} match${totalMatches === 1 ? '' : 'es'} elsewhere online`];
      if (dropshipMatchCount > 0) {
        parts.push(`${dropshipMatchCount} on known resale/dropship sites`);
      } else {
        parts.push('none on known resale/dropship sites');
      }
      return parts.join(', ') + '.';
    }

    case 'complaints': {
      const { hits } = data;
      if (hits === 0) return 'No scam-related mentions found online.';
      return `Found ${hits} scam-related mention${hits === 1 ? '' : 's'} online.`;
    }

    case 'account': {
      const { scamPhraseHits, followRatio } = data;
      const parts = [];
      if (followRatio != null) {
        const ratioStr = followRatio.toFixed(1);
        parts.push(`Follower-to-following ratio: ${ratioStr}`);
      }
      if (scamPhraseHits > 0) {
        parts.push(`${scamPhraseHits} suspicious phrase${scamPhraseHits === 1 ? '' : 's'} found in bio/captions`);
      } else {
        parts.push('no suspicious phrases detected');
      }
      return parts.join(' — ') + '.';
    }

    case 'presence': {
      const { rating, reviewCount, negativeReviewHits } = data;
      const parts = [];
      if (rating != null && reviewCount != null) {
        parts.push(`Rated ${rating} from ${reviewCount.toLocaleString()} review${reviewCount === 1 ? '' : 's'}`);
      }
      if (negativeReviewHits > 0) {
        parts.push(`${negativeReviewHits} negative review flag${negativeReviewHits === 1 ? '' : 's'}`);
      }
      return parts.length > 0
        ? parts.join(', ') + '.'
        : 'Limited store presence data available.';
    }

    default:
      return null;
  }
}

/**
 * Score color — maps a 0-100 signal score to a color.
 */
function scoreColor(score) {
  if (score >= 80) return 'var(--color-band-green)';
  if (score >= 60) return 'var(--color-band-amber)';
  if (score >= 40) return 'var(--color-band-orange)';
  return 'var(--color-band-red)';
}

export default function SignalCard({ signalKey, data }) {
  const meta = SIGNAL_META[signalKey];
  if (!meta) return null;

  const Icon = meta.icon;
  const isNull = data == null;

  return (
    <div
      className={`
        rounded-xl border p-5
        ${isNull
          ? 'border-slate-100 bg-slate-50'
          : 'border-slate-200 bg-white'
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: icon + label + explanation */}
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`
              mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
              ${isNull ? 'bg-slate-100' : 'bg-slate-100'}
            `}
          >
            <Icon
              size={16}
              className={isNull ? 'text-slate-300' : 'text-slate-500'}
            />
          </div>

          <div className="min-w-0">
            <h3
              className={`text-sm font-semibold leading-tight ${
                isNull ? 'text-slate-400' : 'text-slate-800'
              }`}
            >
              {meta.label}
            </h3>

            {isNull ? (
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <Minus size={12} />
                Not checked
              </p>
            ) : (
              <p className="text-sm text-slate-500 mt-1 leading-snug">
                {getExplanation(signalKey, data)}
              </p>
            )}
          </div>
        </div>

        {/* Right: score badge */}
        {!isNull && (
          <div className="flex-shrink-0 text-right">
            <span
              className="text-lg font-bold tabular-nums leading-none"
              style={{ color: scoreColor(data.score) }}
            >
              {data.score}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">/ 100</span>
          </div>
        )}
      </div>
    </div>
  );
}
