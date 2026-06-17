import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import PostCard from '../components/PostCard';

const categoryLabels = {
  tipstricks: 'Tips & Tricks',
  news: 'News',
  ai: 'AI',
  uncategorized: 'Uncategorized',
};

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch 12 posts to split into featured slider (3 posts) and recent grid (9 posts)
        const res = await fetch('/api/post/getposts?limit=12');
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Failed to fetch posts');
          return;
        }

        if (res.ok) {
          setPosts(data.posts || []);
        }
      } catch (err) {
        setError('Could not load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const featuredPosts = posts.slice(0, 3);
  const recentPosts = posts.slice(3, 12);

  // Auto-play interval for carousel slides
  useEffect(() => {
    if (featuredPosts.length === 0 || !isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredPosts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredPosts, isPlaying]);

  const handlePrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredPosts.length) % featuredPosts.length);
  };

  const handleNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredPosts.length);
  };

  const getParsedText = (content) => {
    if (!content) return '';
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    return (doc.body.textContent || '')
      .replace(/\u00A0/g, ' ') // replace non-breaking spaces with normal spaces
      .replace(/\s+/g, ' ')
      .trim();
  };

  const getExcerpt = (content) => {
    const plainText = getParsedText(content);
    return plainText.length > 200 ? plainText.slice(0, 200) + '...' : plainText;
  };

  const getReadingTime = (content) => {
    const plainText = getParsedText(content);
    const wordCount = plainText ? plainText.split(' ').length : 0;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-[rgb(10,18,32)] transition-colors duration-300">
      {/* Hero Section with Cycling Featured Carousel */}
      <section className="relative overflow-hidden border-b border-slate-200/50 dark:border-slate-800/40 py-8 sm:py-12 md:py-16">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none dark:bg-indigo-500/5" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none dark:bg-pink-500/5" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {loading ? (
            /* Premium skeleton loader for carousel */
            <div className="animate-pulse w-full rounded-3xl bg-slate-200/40 dark:bg-slate-900/20 border border-slate-250 dark:border-slate-800/50 h-[400px] sm:h-[480px] md:h-[520px] relative">
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-14 space-y-4 max-w-3xl">
                <div className="flex gap-2">
                  <div className="h-5 w-28 rounded-full bg-slate-300 dark:bg-slate-800" />
                  <div className="h-5 w-20 rounded-full bg-slate-300 dark:bg-slate-800" />
                </div>
                <div className="h-10 w-full sm:w-4/5 rounded-lg bg-slate-300 dark:bg-slate-800" />
                <div className="h-10 w-3/5 rounded-lg bg-slate-300 dark:bg-slate-800" />
                <div className="space-y-2 pt-2">
                  <div className="h-4 w-full rounded-md bg-slate-300 dark:bg-slate-800" />
                  <div className="h-4 w-4/5 rounded-md bg-slate-300 dark:bg-slate-800" />
                </div>
                <div className="h-12 w-36 rounded-xl bg-slate-300 dark:bg-slate-800 pt-2" />
              </div>
            </div>
          ) : featuredPosts.length > 0 ? (
            <div
              className="relative group/carousel rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-xl h-[400px] sm:h-[480px] md:h-[520px]"
              onMouseEnter={() => setIsPlaying(false)}
              onMouseLeave={() => setIsPlaying(true)}
            >
              {/* Slides Container */}
              <div className="relative w-full h-full">
                {featuredPosts.map((post, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <div
                      key={post._id}
                      className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${isActive
                        ? 'opacity-100 scale-100 pointer-events-auto z-10'
                        : 'opacity-0 scale-105 pointer-events-none z-0'
                        }`}
                    >
                      {/* Full Background Image */}
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover/carousel:scale-103"
                        style={{ backgroundImage: `url(${post.image})` }}
                      />
                      {/* Rich Dark Gradient Overlay for Maximum Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

                      {/* Content Overlay */}
                      <div 
                        className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-14 text-left max-w-3xl"
                        style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.75)' }}
                      >
                        <div className="flex items-center gap-2.5 mb-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-600 text-white border border-indigo-500/30">
                            Featured Post
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-xs">
                            {categoryLabels[post.category] || post.category}
                          </span>
                        </div>

                        <Link to={`/post/${post.slug}`} className="block group/title">
                          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white group-hover/title:text-indigo-300 transition-colors duration-200 line-clamp-2">
                            {post.title}
                          </h1>
                        </Link>

                        <div className="flex items-center gap-2 mt-3 text-xs text-slate-300">
                          <span>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                          <span>•</span>
                          <span>{getReadingTime(post.content)} min read</span>
                        </div>

                        <p className="mt-4 text-sm sm:text-base text-slate-200 leading-relaxed line-clamp-2 sm:line-clamp-3">
                          {getExcerpt(post.content)}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-4">
                          <Link
                            to={`/post/${post.slug}`}
                            className="inline-flex items-center justify-center px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-xs border border-white/20 transition-all duration-250 hover:-translate-y-0.5"
                          >
                            Read Article
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Slider Arrows */}
              <button
                onClick={handlePrevSlide}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/15 dark:bg-slate-900/15 border border-white/10 text-white hover:bg-white/25 shadow-md cursor-pointer opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hidden md:block z-20"
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNextSlide}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/15 dark:bg-slate-900/15 border border-white/10 text-white hover:bg-white/25 shadow-md cursor-pointer opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hidden md:block z-20"
                aria-label="Next slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {featuredPosts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-indigo-500' : 'w-2.5 bg-white/40 hover:bg-white/60'
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Fallback if no posts exist */
            <div className="text-center py-12 px-4 rounded-3xl bg-white/20 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800/50">
              <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Welcome to the Blog</h1>
              <p className="text-slate-600 dark:text-slate-400">Discover articles and projects curated by the community.</p>
            </div>
          )}
        </div>
      </section>

      {/* Main Grid Section */}
      <main id="recent-posts" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Recent Articles
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
              The latest posts published by our community.
            </p>
          </div>
          {!loading && recentPosts.length > 0 && (
            <Link
              to="/search"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              View all posts
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          )}
        </div>

        {error && (
          <div className="p-4 mb-8 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 text-red-700 dark:text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Loading state - Premium skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-full flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 p-5 animate-pulse min-h-[380px]"
              >
                <div>
                  <div className="aspect-video w-full rounded-xl bg-slate-200 dark:bg-slate-800 mb-5" />
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-4 w-24 rounded-md bg-slate-200 dark:bg-slate-800" />
                  </div>
                  <div className="h-6 w-full rounded-md bg-slate-200 dark:bg-slate-800 mb-3" />
                  <div className="h-6 w-2/3 rounded-md bg-slate-200 dark:bg-slate-800 mb-4" />
                  <div className="h-4 w-full rounded-md bg-slate-200 dark:bg-slate-800 mb-2" />
                  <div className="h-4 w-5/6 rounded-md bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="h-4 w-24 rounded-md bg-slate-200 dark:bg-slate-800 mt-6 pt-4 border-t border-slate-100/50 dark:border-slate-800/40" />
              </div>
            ))}
          </div>
        ) : recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {recentPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white/30 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-850/40 rounded-2xl">
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              No articles found yet. Check back soon!
            </p>
          </div>
        )}

        {/* Call To Action */}
        <div className="mt-20">
          <CallToAction />
        </div>
      </main>
    </div>
  );
}
