import { useMemo } from 'react';

import { useLocation } from 'react-router-dom'
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';

export default function Dashboard() {
  const location = useLocation();

  const tab = useMemo(() => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get('tab') || '';
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* Profile */}
      {tab === 'profile' && <DashProfile />}

      {/* Posts */}
      {tab === 'posts' && <DashPosts />}

      {/* Comments */}
      {tab === 'comments' && <DashComments />}

      {/* Users */}
      {tab === 'users' && <DashUsers />}

    </div>
  )
}

