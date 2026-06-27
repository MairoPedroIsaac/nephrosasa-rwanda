'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Activity,
  Info, 
  FileText, 
  QrCode, 
  CreditCard, 
  Bell, 
  TrendingUp,
  Calendar,
  MapPin,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  HeartPulse,
  Droplet,
  Users,
  ShieldAlert,
  Stethoscope
} from 'lucide-react';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import apiClient from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface DoctorData {
  full_name: string;
  rmdc_number: string;
  specialty: string;
  phone_number: string;
  is_verified: boolean;
  total_patients: number;
  recent_alerts: any[];
  upcoming_consultations: any[];
}

export default function DoctorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null);

  const fetchDoctorData = async () => {
    try {
      const response = await apiClient.get('/doctor/dashboard/');
      setDoctorData(response.data);
    } catch (error) {
      console.error('Failed to fetch doctor dashboard data', error);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/en/login');
      return;
    }

    const currentUser = getCurrentUser();
    // Use role if available, otherwise check user_type (fallback)
    const isDoctor = currentUser?.role === 'doctor' || currentUser?.user_type === 'DOCTOR';
    
    if (!isDoctor) {
      router.push('/en/patient/dashboard'); // Redirect if patient
      return;
    }

    setUser(currentUser);
    fetchDoctorData().finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-12 bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Modernized Floating Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="bg-gradient-to-br from-primary via-primary-dark to-accent text-white rounded-3xl p-8 shadow-2xl shadow-primary/20 relative overflow-hidden">
          {/* Decorative glass elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent opacity-20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight">
                Welcome back, Dr. {doctorData?.full_name?.split(' ').pop() || user?.last_name}!
              </h1>
              <p className="text-blue-100 text-lg flex items-center gap-2">
                Managing {doctorData?.specialty || 'Nephrology'} practice at NephroSasa.
              </p>
            </div>

            <div className="mt-6 md:mt-0">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20 shadow-inner">
                <div className="flex items-center gap-3 font-medium">
                  <Calendar size={20} className="text-accent-light" />
                  <span>{new Date().toLocaleDateString('en-RW', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Warning (if not verified) */}
      {!doctorData?.is_verified && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm">
            <div className="flex items-center">
              <ShieldAlert className="h-6 w-6 text-amber-500 mr-3" />
              <div>
                <p className="text-sm font-bold text-amber-800">Verification Pending</p>
                <p className="text-sm text-amber-700 mt-1">Your RMDC number is currently being verified. You will not be able to accept new patients or issue prescriptions until verification is complete.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {/* Top Row: Practice Stats & Scan CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Practice Overview Card */}
          <Card className="shadow-xl shadow-primary/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-primary">
              <Users size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity className="text-primary" size={24} />
                  Practice Overview
                </h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Patients</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{doctorData?.total_patients || 0}</h3>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Unread Alerts</p>
                  <h3 className="text-3xl font-bold text-amber-500">{doctorData?.recent_alerts?.length || 0}</h3>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 col-span-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Upcoming Consultations (Today)</p>
                  <h3 className="text-2xl font-bold text-primary">{doctorData?.upcoming_consultations?.length || 0}</h3>
                </div>
              </div>
            </div>
          </Card>

          {/* Scan QR CTA */}
          <Card className="shadow-xl shadow-primary/5 flex flex-col justify-center items-center text-center p-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <QrCode size={40} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Patient Records
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm">
              Scan a patient's NephroSasa QR code or enter their ID to view their full medical history and recent vitals.
            </p>
            <Link href="/en/doctor/scan-qr" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="text-lg w-full">
                Scan Patient QR
                <ArrowRight size={20} className="ml-2 inline" />
              </Button>
            </Link>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Patient Alerts */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl shadow-primary/5 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Bell size={20} className="text-primary" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Patient Alerts</h2>
                </div>
                <Link href="#">
                  <Button variant="outline" size="sm" className="font-medium bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700">
                    View All
                  </Button>
                </Link>
              </div>

              {!doctorData?.recent_alerts || doctorData.recent_alerts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                  <CheckCircle className="mx-auto h-12 w-12 text-teal-400 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">All clear! No critical alerts from your patients.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Map through alerts here, placeholder for now */}
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions & Badge */}
          <div className="flex flex-col gap-6">
            <Card className="shadow-xl shadow-primary/5 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/80">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <Activity size={20} className="text-primary" />
                Quick Actions
              </h2>
              
              <div className="space-y-3">
                <Link href="/en/doctor/prescriptions">
                  <Button variant="primary" size="lg" fullWidth className="group justify-between shadow-md shadow-primary/20">
                    <span className="flex items-center gap-2">
                      <FileText size={18} />
                      Write Prescription
                    </span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link href="/en/doctor/patients">
                  <Button variant="outline" size="lg" fullWidth className="group justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 shadow-sm">
                    <span className="flex items-center gap-2">
                      <Users size={18} className="text-gray-400 dark:text-gray-400" />
                      My Patients
                    </span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-gray-400" />
                  </Button>
                </Link>

                <Link href="/en/doctor/schedule">
                  <Button variant="outline" size="lg" fullWidth className="group justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 shadow-sm">
                    <span className="flex items-center gap-2">
                      <Calendar size={18} className="text-gray-400 dark:text-gray-400" />
                      Schedule
                    </span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-gray-400" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Doctor ID Badge */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-primary/10 border border-gray-200 dark:border-gray-700 overflow-hidden mt-2 group hover:shadow-2xl hover:shadow-primary/20 transition-shadow duration-300">
              {/* Badge Header Bar */}
              <div className="h-14 bg-gradient-to-r from-primary to-accent flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h3 className="text-white font-bold tracking-widest text-sm uppercase flex items-center gap-2">
                  <Stethoscope size={16} /> NephroSasa Provider
                </h3>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-xl flex items-center justify-center shadow-inner border border-primary/20 dark:border-primary/30">
                    <User size={32} className="text-primary" />
                  </div>
                  
                  {/* Status */}
                  <div className={`text-xs font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider flex items-center gap-1 ${doctorData?.is_verified ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'}`}>
                    <CheckCircle size={12} /> {doctorData?.is_verified ? 'Verified' : 'Pending'}
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="space-y-1 mb-6">
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Doctor Name</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight truncate">
                    Dr. {doctorData?.full_name || `${user?.first_name} ${user?.last_name}`}
                  </p>
                  <p className="text-sm text-primary dark:text-primary-light font-medium">
                    {doctorData?.specialty || 'Nephrology'}
                  </p>
                </div>

                {/* Barcode/ID Area */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 flex flex-col items-center justify-center">
                  <p className="font-mono font-bold tracking-widest text-gray-700 dark:text-gray-300 text-sm">
                    RMDC: {doctorData?.rmdc_number || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
