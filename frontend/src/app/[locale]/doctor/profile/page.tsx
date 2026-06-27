'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Hash, Stethoscope, ShieldAlert, CheckCircle, Info, Camera, Edit2 } from 'lucide-react';
import { isAuthenticated, getCurrentUser } from '@/lib/auth';
import apiClient from '@/lib/api';
import Card from '@/components/ui/Card';

export default function DoctorProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState<any>(null);
  const [authUser, setAuthUser] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append('profile_picture', e.target.files[0]);
      try {
        await apiClient.put('/auth/profile/update/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        // Optimistically update the authUser state
        const newPhotoUrl = URL.createObjectURL(e.target.files[0]);
        const updatedUser = { ...authUser, profile_picture: newPhotoUrl };
        setAuthUser(updatedUser);
        
        const stored = localStorage.getItem('user');
        if (stored) {
          localStorage.setItem('user', JSON.stringify({ ...JSON.parse(stored), profile_picture: newPhotoUrl }));
        }
      } catch (err) {
        console.error('Failed to upload profile picture', err);
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/en/login');
      return;
    }
    
    setAuthUser(getCurrentUser());

    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/doctor/dashboard/');
        setDoctorData(response.data);
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
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            Doctor Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Your NephroSasa provider information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="shadow-xl shadow-primary/5 overflow-hidden p-0 border-0">
            <div className="h-40 bg-gradient-to-r from-primary to-accent relative">
              <div className="absolute -bottom-16 left-8 flex flex-col items-center">
                <div className="w-28 h-28 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 flex items-center justify-center text-4xl font-bold text-primary shadow-md overflow-hidden relative group">
                  {authUser?.profile_picture ? (
                    <img src={authUser.profile_picture} alt="Profile" className="w-full h-full object-cover" />
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
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-start gap-3">
                  <Mail className="text-primary mt-1" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">Email Address</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{authUser?.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-start gap-3">
                  <Phone className="text-primary mt-1" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">Phone Number</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{doctorData.phone_number || 'Not provided'}</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-start gap-3 md:col-span-2">
                  <Hash className="text-primary mt-1" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">RMDC License Number</p>
                    <p className="font-semibold text-gray-900 dark:text-white font-mono">{doctorData.rmdc_number}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl shadow-sm dark:bg-blue-900/20 flex items-start gap-3">
            <Info className="text-blue-500 mt-0.5" size={24} />
            <div>
              <p className="font-semibold text-blue-800 dark:text-blue-300">Profile Editing</p>
              <p className="text-blue-700 dark:text-blue-400 text-sm mt-1">
                Profile editing will be available in a future update. For now, to update your RMDC license number or core details, please contact NephroSasa support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
