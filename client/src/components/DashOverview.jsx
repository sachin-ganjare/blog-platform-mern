import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Badge, Button } from 'flowbite-react';
import {
  HiOutlineChatAlt2,
  HiOutlineHome,
  HiOutlinePencilAlt,
  HiOutlineUserGroup,
} from 'react-icons/hi';

const fetchJson = async (url) => {
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  return { res, data };
};

export default function DashOverview() {
  const { currentUser } = useSelector((state) => state.user);
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentComments, setRecentComments] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        const [postsResult, commentsResult, usersResult] = await Promise.all([
          fetchJson('/api/post/getposts?limit=5&order=desc'),
          fetchJson('/api/comment/getcomments?limit=5&sort=desc'),
          fetchJson('/api/user/getusers?limit=5&sort=desc'),
        ]);

        if (postsResult.res.ok) {
          setRecentPosts(postsResult.data.posts || []);
          setTotalPosts(postsResult.data.totalPosts || 0);
          setLastMonthPosts(postsResult.data.lastMonthPosts || 0);
        }

        if (commentsResult.res.ok) {
          setRecentComments(commentsResult.data.comments || []);
          setTotalComments(commentsResult.data.totalComments || 0);
          setLastMonthComments(commentsResult.data.lastMonthComments || 0);
        }

        if (usersResult.res.ok) {
          setRecentUsers((usersResult.data.users || []).slice(0, 5));
          setTotalUsers(usersResult.data.totalUsers || 0);
          setLastMonthUsers(usersResult.data.lastMonthUsers || 0);
        }

        const failedRequest = [postsResult, commentsResult, usersResult].find(
          ({ res }) => !res.ok
        );
        if (failedRequest) {
          setErrorMessage('Some dashboard data could not be loaded.');
        }
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.isAdmin) {
      loadOverview();
    }
  }, [currentUser?.isAdmin]);

  const stats = [
    {
      label: 'Posts',
      value: totalPosts,
      recentValue: lastMonthPosts,
      icon: HiOutlinePencilAlt,
      href: '/dashboard?tab=posts',
      tone: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200',
    },
    {
      label: 'Comments',
      value: totalComments,
      recentValue: lastMonthComments,
      icon: HiOutlineChatAlt2,
      href: '/dashboard?tab=comments',
      tone: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
    },
    {
      label: 'Users',
      value: totalUsers,
      recentValue: lastMonthUsers,
      icon: HiOutlineUserGroup,
      href: '/dashboard?tab=users',
      tone: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-200',
    },
  ];

  return (
    <div className='w-full p-3 md:p-6'>
      <div className='mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <Badge color='gray' icon={HiOutlineHome} className='mb-3 w-fit'>
              Admin dashboard
            </Badge>
            <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
              Welcome back, {currentUser?.username || 'Admin'}
            </h1>
          </div>

          <div className='flex flex-wrap gap-3'>
            <Button as={Link} to='/create-post' color='green'>
              Create post
            </Button>
            <Button as={Link} to='/dashboard?tab=profile' color='gray'>
              Edit profile
            </Button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <Alert color='failure' className='mb-6'>
          {errorMessage}
        </Alert>
      )}

      <div className='grid gap-4 md:grid-cols-3'>
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.label}
              to={stat.href}
              className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800'
            >
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='text-sm font-medium text-gray-600 dark:text-gray-300'>Total {stat.label}</p>
                  <p className='mt-2 text-3xl font-bold text-gray-900 dark:text-white'>
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <div className={`rounded-xl ${stat.tone} p-3 text-gray-800 dark:text-white`}>
                  <Icon className='h-6 w-6' />
                </div>
              </div>
              <p className={`mt-4 text-sm ${loading ? 'text-gray-600 dark:text-gray-400' : stat.recentValue > 0 ? 'text-emerald-600 dark:text-emerald-400' : stat.recentValue < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-600 dark:text-gray-400'}`}>
                Last month: {loading ? '...' : stat.recentValue} {loading ? '' : stat.recentValue > 0 ? '▲' : stat.recentValue < 0 ? '▼' : '■'}
              </p>
            </Link>
          );
        })}
      </div>

      <div className='mt-6 grid gap-6 lg:grid-cols-3'>
        <section className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:col-span-2'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>Recent posts</h2>
            <Link className='text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200' to='/dashboard?tab=posts'>
              View all
            </Link>
          </div>
          <div className='space-y-3'>
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <Link
                  key={post._id}
                  to={`/post/${post.slug}`}
                  className='flex items-center gap-4 rounded-xl border border-gray-100 p-3 bg-white dark:border-gray-700 dark:bg-gray-800'
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className='h-14 w-14 rounded-lg object-cover bg-gray-200'
                  />
                  <div className='min-w-0 flex-1'>
                    <p className='truncate font-medium text-gray-900 dark:text-white'>
                      {post.title}
                    </p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {post.category} · {new Date(post.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                No posts loaded yet.
              </p>
            )}
          </div>
        </section>

        <section className='rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>Recent comments</h2>
            <Link className='text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200' to='/dashboard?tab=comments'>
              View all
            </Link>
          </div>
          <div className='space-y-3'>
            {recentComments.length > 0 ? (
              recentComments.map((comment) => (
                <div
                  key={comment._id}
                  className='rounded-xl border border-gray-100 p-3 dark:border-gray-700'
                >
                  <p className='max-h-20 overflow-hidden text-sm text-gray-700 dark:text-gray-300'>
                    {comment.content}
                  </p>
                  <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                No comments loaded yet.
              </p>
            )}
          </div>
        </section>
      </div>

      <section className='mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>Recent users</h2>
          <Link className='text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200' to='/dashboard?tab=users'>
            View all
          </Link>
        </div>
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-5'>
          {recentUsers.length > 0 ? (
            recentUsers.map((user) => (
              <div
                key={user._id}
                className='flex items-center gap-3 rounded-xl border border-gray-100 p-3 dark:border-gray-700'
              >
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className='h-11 w-11 rounded-full object-cover bg-gray-200'
                />
                <div className='min-w-0'>
                  <p className='truncate font-medium text-gray-900 dark:text-white'>
                    {user.username}
                  </p>
                  <p className='truncate text-sm text-gray-500 dark:text-gray-400'>
                    {user.isAdmin ? 'Admin' : 'User'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className='text-sm text-gray-500 dark:text-gray-400'>No users loaded yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
