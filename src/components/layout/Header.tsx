import React, { useState, useRef, useEffect } from 'react';
import { Bell, Mail, User, X } from 'lucide-react';
import useStore from '../../store';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth';

interface HeaderProps {
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEmails, setShowEmails] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { notifications, emails } = useStore();
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowEmails(false);
    setShowProfile(false);
  };

  const handleEmailClick = () => {
    setShowEmails(!showEmails);
    setShowNotifications(false);
    setShowProfile(false);
  };

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
    setShowNotifications(false);
    setShowEmails(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Click outside for notifications
  useEffect(() => {
    if (!showNotifications) return;
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  // Click outside for emails
  useEffect(() => {
    if (!showEmails) return;
    function handleClickOutside(event: MouseEvent) {
      if (emailRef.current && !emailRef.current.contains(event.target as Node)) {
        setShowEmails(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmails]);

  // Click outside for profile
  useEffect(() => {
    if (!showProfile) return;
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfile]);

  return (
    <div className="flex justify-end items-center h-14 px-4 bg-white border-b border-gray-200 mb-4">
      <div className="flex items-center gap-5 relative">
        <div className="relative">
          <button 
            className="p-2 relative rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={handleNotificationClick}
          >
          <Bell size={22} className="text-gray-600" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {notifications.length}
            </span>
          )}
        </button>
        {showNotifications && (
          <div ref={notificationRef} className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold">Notifications</h3>
              <button onClick={() => setShowNotifications(false)}>
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                >
                  <p className="text-sm">{notification.message}</p>
                  <span className={`text-xs ${
                    notification.type === 'success' ? 'text-green-500' :
                    notification.type === 'error' ? 'text-red-500' :
                    'text-blue-500'
                  }`}>
                    {notification.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
        <div className="relative">
          <button 
            className="p-2 relative rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={handleEmailClick}
          >
          <Mail size={22} className="text-gray-600" />
          {emails.filter(e => e.unread).length > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {emails.filter(e => e.unread).length}
            </span>
          )}
        </button>
        {showEmails && (
          <div ref={emailRef} className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold">Emails</h3>
              <button onClick={() => setShowEmails(false)}>
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {emails.map((email) => (
                <div 
                  key={email.id}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{email.subject}</p>
                      <p className="text-xs text-gray-500">{email.from}</p>
                    </div>
                    {email.unread && (
                      <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
        <div className="relative">
          <button 
            className="h-9 w-9 bg-teal-600 rounded-full flex items-center justify-center text-white hover:bg-teal-700 transition-colors duration-200"
            onClick={handleProfileClick}
          >
            <User size={20} />
          </button>
          {showProfile && (
            <div ref={profileRef} className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-teal-600 rounded-full flex items-center justify-center text-white">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-medium">{userName}</p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <button 
                    className="w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    onClick={() => window.location.href = '/settings'}
                  >
                    Settings
                  </button>
                  <button 
                    className="w-full text-left px-2 py-1.5 text-sm text-red-600 hover:bg-gray-100 rounded"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;