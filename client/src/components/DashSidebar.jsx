import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react'
import { HiUser, HiArrowSmRight } from 'react-icons/hi';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function DashSidebar() {
const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tab = new URLSearchParams(location.search).get('tab') || '';
  
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
            <SidebarItemGroup>
                <Link to='/dashboard?tab=profile'>
                <SidebarItem as='div' active={tab === 'profile'} icon={HiUser} label={'User'} labelColor='dark'>
                    Profile
                </SidebarItem>
                </Link>
                 <SidebarItem onClick={handleSignOut} icon={HiArrowSmRight} className='cursor-pointer'>
                    Sign Out
                </SidebarItem>
            </SidebarItemGroup>
        </SidebarItems>
    </Sidebar>
)
}
