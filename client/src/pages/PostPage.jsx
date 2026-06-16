import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const readingTime = (() => {
    if (!post?.content) return 0;

    const plainText = post.content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const wordCount = plainText ? plainText.split(' ').length : 0;
    return Math.max(1, Math.ceil(wordCount / 200));
  })();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setRecentLoading(true);
        const res = await fetch('/api/post/getposts?limit=5&order=desc');
        const data = await res.json();

        if (res.ok) {
          const filteredPosts = data.posts.filter((item) => item.slug !== postSlug);
          setRecentPosts(filteredPosts.slice(0, 4));
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setRecentLoading(false);
      }
    };

    fetchRecentPosts();
  }, [postSlug]);

  if (loading) {
    return (
      <div className='flex justify-center min-h-screen items-center'>
        <Spinner size='xl' />
      </div>
    )
  }
  return (
    <main className='p-3 max-w-6xl mx-auto min-h-screen'>
      <div className='flex flex-col lg:flex-row gap-10'>
        <article className='flex-1 min-w-0'>
          <h1 className='text-3xl mt-18 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
            {post && post.title}
          </h1>
          <div className='flex justify-center'>
            <Link to={`/search?category=${post && post.category}`}>
              <Button color='gray' pill size='xs'>
                {post && post.category}
              </Button>
            </Link>
          </div>
          <img
            src={post && post.image}
            alt={post && post.title}
            className='mt-10 p-3 max-h-[600px] w-full object-cover mx-auto max-w-3xl text-xs'
          />
          <div className='flex justify-between p-3 border-b border-slate-500 max-w-3xl mx-auto w-full'>
            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
            <span className='italic'>
              {readingTime} mins read
            </span>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: post && post.content }}
            className='p-3 max-w-3xl mx-auto w-full post-content'
          ></div>
          <CallToAction className='mx-auto max-w-3xl' />
          <CommentSection postId={post && post._id} postTitle={post && post.title} />
        </article>

        <aside className='w-full lg:w-80 shrink-0 lg:pt-24'>
          <div className='sticky top-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-5 shadow-sm'>
            <h2 className='text-lg font-semibold mb-4'>Recent Articles</h2>
            {recentLoading ? (
              <div className='space-y-4'>
                <div className='h-20 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse'></div>
                <div className='h-20 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse'></div>
                <div className='h-20 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse'></div>
              </div>
            ) : recentPosts.length > 0 ? (
              <div className='space-y-4'>
                {recentPosts.map((recentPost) => (
                  <Link
                    key={recentPost._id}
                    to={`/post/${recentPost.slug}`}
                    className='flex gap-3 group'
                  >
                    <img
                      src={recentPost.image}
                      alt={recentPost.title}
                      className='w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700 group-hover:opacity-90'
                    />
                    <div className='min-w-0'>
                      <p className='text-sm font-medium leading-snug max-h-10 overflow-hidden group-hover:text-cyan-600'>
                        {recentPost.title}
                      </p>
                      <p className='text-xs text-gray-500 mt-1'>
                        {new Date(recentPost.createdAt).toLocaleDateString()}
                      </p>
                      <p className='text-xs text-gray-500 mt-1 max-h-8 overflow-hidden'>
                        {recentPost.category}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className='text-sm text-gray-500'>No recent articles found.</p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
