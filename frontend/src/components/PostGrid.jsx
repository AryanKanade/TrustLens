import { ImageOff, Check } from 'lucide-react';

export default function PostGrid({ posts, selectedPost, onSelect }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 text-sm">
        This account has no posts to display.
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-medium text-slate-600 mb-3">
        Select the product post you're interested in
      </p>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {posts.map((post) => {
          const isSelected = selectedPost?.id === post.id;
          const imgSrc = post.serpapi_display_url || post.display_url || post.thumbnail_src;

          return (
            <button
              key={post.id}
              type="button"
              onClick={() => onSelect(post)}
              className={`
                relative aspect-square rounded-lg overflow-hidden
                border-2 transition-all duration-150 cursor-pointer
                focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2
                ${isSelected
                  ? 'border-slate-900 ring-1 ring-slate-900'
                  : 'border-transparent hover:border-slate-300'
                }
              `}
            >
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={post.media_captions?.[0] || 'Post image'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                  <ImageOff size={20} className="text-slate-300" />
                </div>
              )}

              {/* Video badge */}
              {post.is_video && (
                <span className="absolute top-1.5 right-1.5 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                  VIDEO
                </span>
              )}

              {/* Selected overlay */}
              {isSelected && (
                <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                    <Check size={16} className="text-slate-900" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
