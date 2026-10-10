import { Users, UserCheck, BadgeCheck, Briefcase } from 'lucide-react';

/**
 * Format large numbers with K/M suffixes for readability.
 */
function formatCount(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 10_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toLocaleString();
}

export default function ProfileCard({ profile }) {
  const {
    full_name,
    biography,
    followers,
    following,
    is_verified,
    is_professional_account,
  } = profile;

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-slate-50/80 p-5">
      {/* Name + badges */}
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-base font-semibold text-slate-900 leading-tight">
          {full_name || 'Unnamed account'}
        </h2>
        {is_verified && (
          <span title="Verified account" className="text-blue-500 flex-shrink-0">
            <BadgeCheck size={17} />
          </span>
        )}
        {is_professional_account && (
          <span
            title="Professional account"
            className="text-slate-400 flex-shrink-0"
          >
            <Briefcase size={15} />
          </span>
        )}
      </div>

      {/* Bio */}
      {biography && (
        <p className="text-sm text-slate-500 mb-4 line-clamp-3 whitespace-pre-line leading-relaxed">
          {biography}
        </p>
      )}

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-slate-400" />
          <span className="font-semibold text-slate-800">{formatCount(followers)}</span>
          <span className="text-slate-500">followers</span>
        </div>
        <div className="flex items-center gap-1.5">
          <UserCheck size={14} className="text-slate-400" />
          <span className="font-semibold text-slate-800">{formatCount(following)}</span>
          <span className="text-slate-500">following</span>
        </div>
      </div>
    </div>
  );
}
