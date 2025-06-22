import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Users, 
  Wrench, 
  BellRing, 
  FileText, 
  BarChart2, 
  Settings 
} from 'lucide-react';
import useStore from '../../store';

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  to: string;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, to, isActive }) => {
  return (
    <Link 
      to={to}
      className={`flex items-center gap-3 p-4 cursor-pointer transition-colors duration-200
        ${isActive 
          ? 'bg-teal-100 text-teal-800 font-medium rounded-md' 
          : 'hover:bg-teal-50 text-gray-700'
        }`}
    >
      <div className={`${isActive ? 'text-teal-700' : 'text-gray-600'}`}>{icon}</div>
      <span className="text-lg">{text}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const companyName = useStore(state => state.companyName);
  const currentPath = location.pathname.split('/')[1] || 'dashboard';

  const navItems = [
    { id: 'dashboard', icon: <Home size={22} />, text: 'Dashboard', path: '/dashboard' },
    { id: 'properties', icon: <Building2 size={22} />, text: 'Properties', path: '/properties' },
    { id: 'tenants', icon: <Users size={22} />, text: 'Tenants', path: '/tenants' },
    { id: 'maintenance', icon: <Wrench size={22} />, text: 'Maintenance', path: '/maintenance' },
    { id: 'announcements', icon: <BellRing size={22} />, text: 'Announcements', path: '/announcements' },
    { id: 'contracts', icon: <FileText size={22} />, text: 'Contracts', path: '/contracts' },
    { id: 'reports', icon: <BarChart2 size={22} />, text: 'Reports', path: '/reports' },
    { id: 'settings', icon: <Settings size={22} />, text: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 py-6 flex flex-col">
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-bold text-teal-800">{companyName}</h1>
      </div>
      <div className="flex-1">
        {navItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            text={item.text}
            to={item.path}
            isActive={currentPath === item.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;