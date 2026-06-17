import { Link } from 'react-router-dom';

const categoryLabels = {
  tipstricks: 'Tips & Tricks',
  news: 'News',
  ai: 'AI',
  uncategorized: 'Uncategorized',
};

export default function PostCard({ post }) {
  // Parse HTML content to get clean plain text with entities decoded
  const plainText = (() => {
    if (!post.content) return '';
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, 'text/html');
    return (doc.body.textContent || '')
      .replace(/\u00A0/g, ' ') // replace non-breaking spaces with normal spaces
      .replace(/\s+/g, ' ')
      .trim();
  })();
  
  const excerpt = plainText.length > 140 ? plainText.slice(0, 140) + '...' : plainText;

  // Calculate reading time
  const readingTime = (() => {
    const wordCount = plainText ? plainText.split(' ').length : 0;
    return Math.max(1, Math.ceil(wordCount / 200));
  })();

  const categoryLabel = categoryLabels[post.category] || post.category;

  return (
    <article className="group relative w-full flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <Link to={`/post/${post.slug}`} className="block overflow-hidden relative aspect-video">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/50">
            {categoryLabel}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span>•</span>
            <span>{readingTime} min read</span>
          </div>
        </div>

        <Link to={`/post/${post.slug}`} className="block">
          <h3 className="text-xl font-bold leading-snug text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 line-clamp-2 min-h-[3.5rem]">
            {post.title}
          </h3>
        </Link>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-3 flex-1">
          {excerpt}
        </p>

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60">
          <Link
            to={`/post/${post.slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200"
          >
            Read article
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
