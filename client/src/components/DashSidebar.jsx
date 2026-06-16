import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react'
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiOutlineChatAlt2 } from 'react-icons/hi';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'


export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tab = new URLSearchParams(location.search).get('tab') || '';
  const { currentUser } = useSelector(state => state.user);

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
      });

      if (res.ok) {
        dispatch(signOutSuccess());
        navigate('/sign-in');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sidebar className='w-full md:w-56'>
      <SidebarItems>
        <SidebarItemGroup className='flex flex-col gap-1'>
          <Link to='/dashboard?tab=profile'>
            <SidebarItem as='div' active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark'>
              Profile
            </SidebarItem>
          </Link>
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=posts'>
              <SidebarItem as='div' active={tab === 'posts'} icon={HiDocumentText} labelColor='dark'>
                Posts
              </SidebarItem>
            </Link>
          )}

          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=comments'>
              <SidebarItem as='div' active={tab === 'comments'} icon={HiOutlineChatAlt2} labelColor='dark'>
                Comments
              </SidebarItem>
            </Link>
          )}

           {currentUser.isAdmin && (
            <Link to='/dashboard?tab=users'>
              <SidebarItem as='div' active={tab === 'users'} icon={HiOutlineUserGroup} labelColor='dark'>
                Users
              </SidebarItem>
            </Link>
          )}

          <SidebarItem onClick={handleSignOut} icon={HiArrowSmRight} className='cursor-pointer'>
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  )
}
