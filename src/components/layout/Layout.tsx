import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import useAuthStore from '../../store/auth';

const Layout: React.FC = () => {
  const user = useAuthStore(state => state.user);
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-full p-6">
          <Header userName={user?.email || 'User'} />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;