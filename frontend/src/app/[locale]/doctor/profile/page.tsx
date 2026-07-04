'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Hash, Stethoscope, ShieldAlert, CheckCircle, Camera, Edit2, X, Trash2, Shield, Eye, EyeOff } from 'lucide-react';
import { isAuthenticated, getCurrentUser } from '@/lib/auth';
import apiClient, { API_URL } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const getImageUrl = (url: string | null | undefined) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;
  return `${API_URL.replace('/api', '')}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function DoctorProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState<any>(null);
  const [authUser, setAuthUser] = useState<any>(null);
  
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '', phone_number: '' });
  
  // Profile edit messages
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password fields and state
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', confirm_new_password: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordFieldErrors, setPasswordFieldErrors] = useState({ current_password: '', new_password: '', confirm_new_password: '' });
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const passwordSectionRef = useRef<HTMLDivElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append('profile_picture', e.target.files[0]);
      try {
        const response = await apiClient.put('/auth/profile/update/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        const newPhotoUrl = response.data.user.profile_picture;
        const updatedUser = { ...authUser, profile_picture: newPhotoUrl };
        setAuthUser(updatedUser);
        
        const stored = localStorage.getItem('user');
        if (stored) {
          localStorage.setItem('user', JSON.stringify({ ...JSON.parse(stored), profile_picture: newPhotoUrl }));
        }
        window.dispatchEvent(new Event('userProfileUpdated'));
      } catch (err) {
        console.error('Failed to upload profile picture', err);
      }
    }
  };

  const handleRemovePhoto = () => {
    const updatedUser = { ...authUser, profile_picture: null };
    setAuthUser(updatedUser);
    
    const stored = localStorage.getItem('user');
    if (stored) {
      localStorage.setItem('user', JSON.stringify({ ...JSON.parse(stored), profile_picture: null }));
    }
    window.dispatchEvent(new Event('userProfileUpdated'));
    setProfileMessage("Profile photo removed.");
    setTimeout(() => setProfileMessage(''), 3000);
  };

  const handleChangePassword = async () => {
    setPasswordFieldErrors({ current_password: '', new_password: '', confirm_new_password: '' });
    setPasswordSuccessMessage('');

    let hasError = false;
    const errors = { current_password: '', new_password: '', confirm_new_password: '' };
    
    if (!passwordForm.current_password) {
      errors.current_password = 'This field is required';
      hasError = true;
    }
    if (!passwordForm.new_password) {
      errors.new_password = 'This field is required';
      hasError = true;
    }
    if (!passwordForm.confirm_new_password) {
      errors.confirm_new_password = 'This field is required';
      hasError = true;
    }

    if (hasError) {
      setPasswordFieldErrors(errors);
      passwordSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      const response = await apiClient.post('/auth/change-password/', passwordForm);
      setPasswordSuccessMessage('Password updated successfully');
      setPasswordForm({ current_password: '', new_password: '', confirm_new_password: '' });
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to change password';
      const newErrors = { current_password: '', new_password: '', confirm_new_password: '' };
      
      if (errorMsg.toLowerCase().includes('current password')) {
        newErrors.current_password = errorMsg;
      } else if (errorMsg.toLowerCase().includes('match')) {
        newErrors.confirm_new_password = errorMsg;
      } else {
        newErrors.current_password = errorMsg;
      }
      setPasswordFieldErrors(newErrors);
      passwordSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSaveDetails = async () => {
    try {
      setProfileMessage('');
      setProfileError('');
      const response = await apiClient.put('/auth/profile/update/', editForm);
      setProfileMessage(response.data.message || 'Profile updated successfully (Note: Specialty update not supported by backend)');
      setIsEditingMode(false);
      
      const updatedUser = { ...authUser, ...editForm };
      setAuthUser(updatedUser);
      
      setDoctorData({
        ...doctorData,
        full_name: `${editForm.first_name} ${editForm.last_name}`.trim() || doctorData.full_name,
        phone_number: editForm.phone_number
      });
      
      const stored = localStorage.getItem('user');
      if (stored) {
        localStorage.setItem('user', JSON.stringify({ ...JSON.parse(stored), ...editForm }));
      }
      setTimeout(() => setProfileMessage(''), 3000);
    } catch (err: any) {
      setProfileError(err.response?.data?.error || 'Failed to update details');
      setTimeout(() => setProfileError(''), 3000);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/en/login');
      return;
    }
    
    const user = getCurrentUser();
    setAuthUser(user);

    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/doctor/dashboard/');
        setDoctorData(response.data);
        if (user) {
          setEditForm({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            phone_number: user.phone_number || response.data.phone_number || ''
          });
        }
      } catch (err) {
        console.error('Failed to fetch doctor profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-full pb-12 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!doctorData) {
    return (
      <div className="min-h-full pb-12 bg-gray-50 dark:bg-gray-900 p-8 text-center">
        <p className="text-gray-500">Failed to load profile. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-12 bg-gray-50 dark:bg-gray-900 transition-colors p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Top alerts just for profile edits if any */}
        {profileMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg flex items-center justify-between">
            <span>{profileMessage}</span>
            <button onClick={() => setProfileMessage('')}><X size={16} /></button>
          </div>
        )}
        {profileError && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg flex items-center justify-between">
            <span>{profileError}</span>
            <button onClick={() => setProfileError('')}><X size={16} /></button>
          </div>
        )}

        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              Doctor Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Your NephroSasa provider information.
            </p>
          </div>
          {!isEditingMode ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditingMode(true)} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <Edit2 size={14} className="mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditingMode(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleSaveDetails}>Save</Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="shadow-xl shadow-primary/5 overflow-hidden p-0 border-0">
            <div className="h-40 bg-gradient-to-r from-primary to-accent relative">
              <div className="absolute -bottom-16 left-8 flex flex-col items-center">
                <div className="w-28 h-28 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 flex items-center justify-center text-4xl font-bold text-primary shadow-md overflow-hidden relative group">
                  {authUser?.profile_picture ? (
                    <img src={getImageUrl(authUser.profile_picture)} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{doctorData.full_name?.charAt(0) || 'D'}</span>
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

                <button 
                  className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary dark:text-primary-light hover:underline bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-full shadow-sm backdrop-blur-sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Edit2 size={12} />
                  Edit Photo
                </button>
              </div>
            </div>
            
            <div className="pt-20 pb-8 px-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Dr. {doctorData.full_name}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <Stethoscope size={16} /> {doctorData.specialty}
                  </p>
                </div>
                
                <div>
                  {doctorData.is_verified ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50 shadow-sm">
                      <CheckCircle size={16} /> Verified Provider
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50 shadow-sm">
                      <ShieldAlert size={16} /> Verification Pending
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEditingMode ? (
                  <>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <User size={16} /> First Name
                      </label>
                      <input 
                        type="text" 
                        value={editForm.first_name} 
                        onChange={e => setEditForm({...editForm, first_name: e.target.value})}
                        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <User size={16} /> Last Name
                      </label>
                      <input 
                        type="text" 
                        value={editForm.last_name} 
                        onChange={e => setEditForm({...editForm, last_name: e.target.value})}
                        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-start gap-3 md:col-span-2">
                    <User className="text-primary mt-1" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">Full Name</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{doctorData.full_name}</p>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-start gap-3">
                  <Mail className="text-primary mt-1" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">Email Address</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{authUser?.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-start gap-3">
                  <Phone className="text-primary mt-1" size={20} />
                  <div className="w-full">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">Phone Number</p>
                    {isEditingMode ? (
                      <input 
                        type="text" 
                        value={editForm.phone_number} 
                        onChange={e => setEditForm({...editForm, phone_number: e.target.value})}
                        className="w-full mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="font-semibold text-gray-900 dark:text-white">{doctorData.phone_number || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-start gap-3 md:col-span-2">
                  <Hash className="text-primary mt-1" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">RMDC License Number <span className="text-xs ml-2 text-amber-600 dark:text-amber-400 font-normal border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">Read-only</span></p>
                    <p className="font-semibold text-gray-900 dark:text-white font-mono">{doctorData.rmdc_number}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section A: Remove Profile Photo */}
          <Card className="shadow-xl shadow-primary/5 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden shrink-0">
                  {authUser?.profile_picture ? (
                    <img src={getImageUrl(authUser.profile_picture)} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    <Camera size={18} className="text-gray-500" />
                    Profile Photo
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Remove your current profile photo.
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRemovePhoto} 
                disabled={!authUser?.profile_picture}
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Trash2 size={16} className="mr-2" />
                Remove Photo
              </Button>
            </div>
          </Card>

          {/* Section B: Change Password */}
          <div ref={passwordSectionRef}>
            <Card className="shadow-xl shadow-primary/5 p-6 border-t-4 border-accent">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield size={18} className="text-accent" />
                Change Password
              </h3>
              
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.current_password}
                      onChange={e => setPasswordForm({...passwordForm, current_password: e.target.value})}
                      className={`w-full bg-white dark:bg-gray-800 border ${passwordFieldErrors.current_password ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg p-2.5 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none`}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordFieldErrors.current_password && (
                    <p className="text-red-500 text-xs mt-1">{passwordFieldErrors.current_password}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                  <div className="relative">
                    <input 
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.new_password}
                      onChange={e => setPasswordForm({...passwordForm, new_password: e.target.value})}
                      className={`w-full bg-white dark:bg-gray-800 border ${passwordFieldErrors.new_password ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg p-2.5 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none`}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordFieldErrors.new_password && (
                    <p className="text-red-500 text-xs mt-1">{passwordFieldErrors.new_password}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirm_new_password}
                      onChange={e => setPasswordForm({...passwordForm, confirm_new_password: e.target.value})}
                      className={`w-full bg-white dark:bg-gray-800 border ${passwordFieldErrors.confirm_new_password ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg p-2.5 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none`}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordFieldErrors.confirm_new_password && (
                    <p className="text-red-500 text-xs mt-1">{passwordFieldErrors.confirm_new_password}</p>
                  )}
                </div>
                
                <div className="pt-2">
                  <Button variant="primary" onClick={handleChangePassword}>Update Password</Button>
                  {passwordSuccessMessage && (
                    <p className="text-green-600 text-sm mt-2">{passwordSuccessMessage}</p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
