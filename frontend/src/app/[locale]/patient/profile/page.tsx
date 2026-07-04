'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, Edit2, Shield, Camera, X, Eye, EyeOff } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import apiClient, { API_URL } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const getImageUrl = (url: string | null | undefined) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;
  return `${API_URL.replace('/api', '')}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  
  // States
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '', phone_number: '' });
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', confirm_new_password: '' });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setEditForm({
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        phone_number: currentUser.phone_number || ''
      });
    }
  }, []);

  const handleSaveDetails = async () => {
    try {
      setMessage('');
      setError('');
      const response = await apiClient.put('/auth/profile/update/', editForm);
      setMessage(response.data.message || 'Profile updated successfully');
      setIsEditingMode(false);
      
      const updatedUser = { ...user, ...editForm };
      setUser(updatedUser);
      const stored = localStorage.getItem('user');
      if (stored) {
        localStorage.setItem('user', JSON.stringify({ ...JSON.parse(stored), ...editForm }));
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update details');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append('profile_picture', e.target.files[0]);
      try {
        setMessage('');
        setError('');
        const response = await apiClient.put('/auth/profile/update/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Profile picture updated successfully!');
        const newPhotoUrl = response.data.user.profile_picture;
        const updatedUser = { ...user, profile_picture: newPhotoUrl };
        setUser(updatedUser);
        
        const stored = localStorage.getItem('user');
        if (stored) {
          localStorage.setItem('user', JSON.stringify({ ...JSON.parse(stored), profile_picture: newPhotoUrl }));
        }
        window.dispatchEvent(new Event('userProfileUpdated'));
      } catch (err) {
        setError('Failed to upload profile picture');
      }
    }
  };

  const handleChangePassword = async () => {
    try {
      setMessage('');
      setError('');
      const response = await apiClient.post('/auth/change-password/', passwordForm);
      setMessage(response.data.message || 'Password changed successfully');
      setIsPasswordModalOpen(false);
      setPasswordForm({ current_password: '', new_password: '', confirm_new_password: '' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to change password');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Alerts */}
      {message && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage('')}><X size={16} /></button>
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')}><X size={16} /></button>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <User className="text-primary" size={32} />
          Patient Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your personal information and security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="text-center shadow-xl shadow-primary/5 p-8 relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg overflow-hidden relative group">
              {user.profile_picture ? (
                <img src={getImageUrl(user.profile_picture)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{user.first_name?.[0] || '?'}{user.last_name?.[0] || '?'}</span>
              )}
              <div 
                className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="text-white" size={24} />
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">NephroSasa Patient</p>
            <Button 
              variant="outline" 
              fullWidth 
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              onClick={() => fileInputRef.current?.click()}
            >
              <Edit2 size={16} className="mr-2" />
              Edit Photo
            </Button>
          </Card>

          <Card className="shadow-xl shadow-primary/5 p-6 border-t-4 border-accent">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield size={18} className="text-accent" />
              Account Status
            </h3>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Status</span>
              <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded text-xs font-bold">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Verification</span>
              <span className="text-gray-900 dark:text-white text-sm font-medium">Verified</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Patient ID</span>
              <span className="text-gray-900 dark:text-white text-sm font-medium">NSR-{user.id?.toString().padStart(4, '0')}</span>
            </div>
          </Card>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="md:col-span-2">
          <Card className="shadow-xl shadow-primary/5 p-8 h-full">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
              {!isEditingMode ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditingMode(true)} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <Edit2 size={14} className="mr-2" />
                  Edit Details
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditingMode(false)}>Cancel</Button>
                  <Button variant="primary" size="sm" onClick={handleSaveDetails}>Save</Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <User size={16} /> First Name
                </label>
                {isEditingMode ? (
                  <input 
                    type="text" 
                    value={editForm.first_name} 
                    onChange={e => setEditForm({...editForm, first_name: e.target.value})}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-white text-lg">{user.first_name}</p>
                )}
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <User size={16} /> Last Name
                </label>
                {isEditingMode ? (
                  <input 
                    type="text" 
                    value={editForm.last_name} 
                    onChange={e => setEditForm({...editForm, last_name: e.target.value})}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-white text-lg">{user.last_name}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <Mail size={16} /> Email Address
                </label>
                <p className="font-medium text-gray-500 dark:text-gray-500 text-lg cursor-not-allowed">{user.email}</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <Phone size={16} /> Phone Number
                </label>
                {isEditingMode ? (
                  <input 
                    type="text" 
                    value={editForm.phone_number} 
                    onChange={e => setEditForm({...editForm, phone_number: e.target.value})}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-white text-lg">{user.phone_number || 'Not provided'}</p>
                )}
              </div>

              <div className="sm:col-span-2 mt-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Password</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password</p>
                  </div>
                  <Button variant="outline" size="sm" className="bg-white dark:bg-gray-800" onClick={() => setIsPasswordModalOpen(true)}>
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                <div className="relative">
                  <input 
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordForm.current_password}
                    onChange={e => setPasswordForm({...passwordForm, current_password: e.target.value})}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.new_password}
                    onChange={e => setPasswordForm({...passwordForm, new_password: e.target.value})}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordForm.confirm_new_password}
                    onChange={e => setPasswordForm({...passwordForm, confirm_new_password: e.target.value})}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="pt-4 flex gap-3">
                <Button variant="outline" fullWidth onClick={() => setIsPasswordModalOpen(false)}>Cancel</Button>
                <Button variant="primary" fullWidth onClick={handleChangePassword}>Save Password</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
