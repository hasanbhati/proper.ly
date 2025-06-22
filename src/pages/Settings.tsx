import { User, Mail, Phone, Key, Globe, Bell, Shield, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import useStore from '../store';
import { getUserProfile, updateUserProfile, changeUserPassword } from '../data/userApi';
import type { UserProfile } from '../types';

const Settings: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profilePassword, setProfilePassword] = useState('');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const companyName = useStore(state => state.companyName);
  const setCompanyName = useStore(state => state.setCompanyName);

  // Remove hardcoded user profile fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    setProfileLoading(true);
    getUserProfile()
      .then((data) => {
        setProfile(data);
        setProfileLoading(false);
      })
      .catch(() => {
        setProfileError('Failed to load profile.');
        setProfileLoading(false);
      });
  }, []);

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleSaveChanges = async () => {
    setProfileError('');
    setProfileSuccess('');
    if (!profile) return;
    if (!profilePassword) {
      setProfileError('Please enter your password to save changes.');
      return;
    }
    setProfileLoading(true);
    const res = await updateUserProfile(profile, profilePassword);
    setProfileLoading(false);
    if (res.success) {
      setProfileSuccess(res.message);
      setEditMode(false);
      setProfilePassword('');
    } else {
      setProfileError(res.message);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setPasswordLoading(true);
    const res = await changeUserPassword(currentPassword, newPassword);
    setPasswordLoading(false);
    if (res.success) {
      setPasswordSuccess(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordError(res.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Profile Settings</h2>
        </div>
        <div className="p-5">
          {profileLoading ? (
            <div className="text-center text-gray-500">Loading profile...</div>
          ) : profile ? (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="h-24 w-24 bg-teal-600 rounded-full flex items-center justify-center text-white text-xl font-semibold mb-3">
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </div>
                <button className="text-gray-400 text-sm font-medium cursor-not-allowed" disabled>
                  Change Picture (coming soon)
                </button>
              </div>
              <div className="flex-grow space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      id="companyName"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      value={profile.companyName}
                      onChange={e => handleProfileChange('companyName', e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      value={profile.firstName}
                      onChange={e => handleProfileChange('firstName', e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      value={profile.lastName}
                      onChange={e => handleProfileChange('lastName', e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        value={profile.email}
                        onChange={e => handleProfileChange('email', e.target.value)}
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={16} className="text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        value={profile.phone}
                        onChange={e => handleProfileChange('phone', e.target.value)}
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                </div>
                {profileError && <div className="text-red-500 text-sm mt-2">{profileError}</div>}
                {profileSuccess && <div className="text-green-600 text-sm mt-2">{profileSuccess}</div>}
                <div className="pt-3 flex flex-col md:flex-row md:justify-end gap-2">
                  {!editMode ? (
                    <button
                      className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                      onClick={() => setEditMode(true)}
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <input
                        type="password"
                        className="mr-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Enter password to save changes"
                        value={profilePassword}
                        onChange={e => setProfilePassword(e.target.value)}
                        autoComplete="current-password"
                        style={{ minWidth: 220 }}
                      />
                      <button
                        className="mr-2 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => { setEditMode(false); setProfileError(''); setProfileSuccess(''); setProfilePassword(''); }}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                        onClick={handleSaveChanges}
                        disabled={profileLoading}
                      >
                        {profileLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-red-500">{profileError || 'No profile data.'}</div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex items-center">
            <Key size={18} className="text-gray-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-800">Security</h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                disabled={passwordLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                autoComplete="new-password"
                disabled={passwordLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                disabled={passwordLoading}
              />
            </div>
            {passwordError && <div className="text-red-500 text-sm mt-2">{passwordError}</div>}
            {passwordSuccess && <div className="text-green-600 text-sm mt-2">{passwordSuccess}</div>}
            <div className="pt-2 flex justify-end">
              <button
                className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                onClick={handlePasswordChange}
                disabled={passwordLoading}
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex items-center">
            <Bell size={18} className="text-gray-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-800">Notifications</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Email Notifications</h3>
                <p className="text-xs text-gray-500 mt-1">Receive email for rent payments, maintenance requests, etc.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">SMS Notifications</h3>
                <p className="text-xs text-gray-500 mt-1">Receive SMS alerts for urgent matters</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Weekly Reports</h3>
                <p className="text-xs text-gray-500 mt-1">Receive weekly summary reports</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;