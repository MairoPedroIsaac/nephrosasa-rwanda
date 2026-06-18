'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Activity, 
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
  Droplet
} from 'lucide-react';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import apiClient from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

/**
 * PATIENT DASHBOARD PAGE
 * Shows overview of patient's health data, AI kidney risk score, and quick actions
 */

interface VitalsRecord {
  id: number;
  recorded_at: string;
  systolic_bp: number;
  diastolic_bp: number;
  blood_sugar: number;
  ai_risk_score: string;
  confidence_percentage: number;
}

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [recentVitals, setRecentVitals] = useState<VitalsRecord[]>([]);

  // Form moved to separate page

  const fetchVitalsHistory = async () => {
    try {
      const response = await apiClient.get('/vitals/history/');
      setRecentVitals(response.data);
    } catch (error) {
      console.error('Failed to fetch vitals history', error);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/en/login');
      return;
    }

    const currentUser = getCurrentUser();
    if (currentUser?.user_type !== 'PATIENT') {
      router.push('/en/doctor/dashboard'); // Redirect if doctor
      return;
    }

    setUser(currentUser);
    fetchVitalsHistory().finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-12">
      {/* Modernized Floating Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="bg-gradient-to-br from-primary via-primary-dark to-accent text-white rounded-3xl p-8 shadow-2xl shadow-primary/20 relative overflow-hidden">
          {/* Decorative glass elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent opacity-20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight">
                {recentVitals.length === 0 ? "Welcome to NephroSasa" : "Welcome back"}, {user?.first_name}!
              </h1>
              <p className="text-blue-100 text-lg flex items-center gap-2">
                Proactively monitoring your kidney health.
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Row: AI Score & Logging Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* AI Kidney Risk Score Card */}
          <Card className="border-t-4 border-primary shadow-xl shadow-primary/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-primary">
              <Activity size={120} />
            </div>
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Activity className="text-primary" size={24} />
                AI Kidney Risk Assessment
              </h2>
              
              {recentVitals.length === 0 ? (
                /* Friendly Empty State */
                <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <HeartPulse size={32} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No data available yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                    Log your first blood pressure and sugar reading to get your personalized AI risk assessment.
                  </p>
                </div>
              ) : (
                /* Data State */
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Current Status</p>
                      <h3 className={`text-4xl font-extrabold tracking-tight ${recentVitals[0]?.ai_risk_score === 'HIGH' ? 'text-red-600' : recentVitals[0]?.ai_risk_score === 'LOW' ? 'text-teal-600' : 'text-amber-500'}`}>
                        {recentVitals[0] ? `${recentVitals[0].ai_risk_score} RISK` : ''}
                      </h3>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">Model Confidence: <span className="text-gray-700 dark:text-gray-300">{recentVitals[0] ? `${recentVitals[0].confidence_percentage}%` : ''}</span></p>
                    </div>
                    
                    {/* Visual Indicator */}
                    <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${recentVitals[0]?.ai_risk_score === 'HIGH' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-800' : recentVitals[0]?.ai_risk_score === 'LOW' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 dark:border-teal-800' : 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800'}`}>
                      <TrendingUp className={recentVitals[0]?.ai_risk_score === 'HIGH' ? 'text-red-500 dark:text-red-400' : recentVitals[0]?.ai_risk_score === 'LOW' ? 'text-teal-500 dark:text-teal-400' : 'text-amber-500 dark:text-amber-400'} size={28} />
                    </div>
                  </div>

                  {recentVitals[0]?.ai_risk_score !== 'LOW' && (
                    <div className={`rounded-xl p-4 mb-4 border ${recentVitals[0]?.ai_risk_score === 'HIGH' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/50' : 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50'}`}>
                      <h4 className={`font-semibold flex items-center gap-2 mb-2 ${recentVitals[0]?.ai_risk_score === 'HIGH' ? 'text-red-800 dark:text-red-400' : 'text-amber-800 dark:text-amber-400'}`}>
                        <AlertCircle size={18} />
                        Action Required
                      </h4>
                      <p className={`text-sm leading-relaxed ${recentVitals[0]?.ai_risk_score === 'HIGH' ? 'text-red-700 dark:text-red-300' : 'text-amber-700 dark:text-amber-300'}`}>
                        Your recent readings indicate a higher risk for kidney function decline. Please maintain your prescribed medication and schedule a remote consultation with your nephrologist.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Required Medical Disclaimer */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700 mt-6">
                <p className="text-xs text-gray-500 dark:text-gray-400 italic leading-tight">
                  <span className="font-semibold text-gray-600 dark:text-gray-300">Medical Disclaimer:</span> This AI-generated risk score is a screening tool based on the data you provided. It is NOT a clinical diagnosis. Always consult your registered healthcare provider before making any medical decisions.
                </p>
              </div>
            </div>
          </Card>

          {/* Log Vitals CTA */}
          <Card className="shadow-xl shadow-primary/5 flex flex-col justify-center items-center text-center p-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <HeartPulse size={40} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Time for a Check-in?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm">
              Keep your AI predictive model up to date by logging your daily blood pressure and fasting sugar.
            </p>
            <Link href="/en/patient/log-vitals" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="text-lg w-full">
                Log Vitals Now
                <ArrowRight size={20} className="ml-2 inline" />
              </Button>
            </Link>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Vitals History */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl shadow-primary/5 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-primary" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Vitals History</h2>
                </div>
                <Link href="/en/patient/records">
                  <Button variant="outline" size="sm" className="font-medium bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700">
                    View All Records
                  </Button>
                </Link>
              </div>

              {recentVitals.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No history available</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
                        <th className="p-4 text-xs tracking-wider font-semibold text-gray-500 dark:text-gray-400 uppercase">Date & Time</th>
                        <th className="p-4 text-xs tracking-wider font-semibold text-gray-500 dark:text-gray-400 uppercase">Blood Pressure</th>
                        <th className="p-4 text-xs tracking-wider font-semibold text-gray-500 dark:text-gray-400 uppercase">Blood Sugar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                      {recentVitals.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="p-4">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(record.recorded_at).toLocaleDateString('en-RW', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {new Date(record.recorded_at).toLocaleTimeString('en-RW', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                              record.systolic_bp > 140 || record.diastolic_bp > 90
                                ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
                                : record.systolic_bp > 130 || record.diastolic_bp > 85
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                                : 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border border-teal-200 dark:border-teal-800'
                            }`}>
                              {record.systolic_bp} / {record.diastolic_bp} mmHg
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                            {record.blood_sugar} <span className="text-gray-500 dark:text-gray-500 text-xs font-normal">mmol/L</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                <Link href="/en/patient/consult">
                  <Button variant="primary" size="lg" fullWidth className="group justify-between shadow-md shadow-primary/20">
                    <span className="flex items-center gap-2">
                      <User size={18} />
                      Consult Nephrologist
                    </span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link href="/en/patient/qr-code">
                  <Button variant="outline" size="lg" fullWidth className="group justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 shadow-sm">
                    <span className="flex items-center gap-2">
                      <QrCode size={18} className="text-gray-400 dark:text-gray-400" />
                      Share Health Record
                    </span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-gray-400" />
                  </Button>
                </Link>

                <Link href="/en/patient/payments">
                  <Button variant="outline" size="lg" fullWidth className="group justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 shadow-sm">
                    <span className="flex items-center gap-2">
                      <CreditCard size={18} className="text-gray-400 dark:text-gray-400" />
                      Mobile Money Payments
                    </span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-gray-400" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Medical ID Badge */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-primary/10 border border-gray-200 dark:border-gray-700 overflow-hidden mt-2 group hover:shadow-2xl hover:shadow-primary/20 transition-shadow duration-300">
              {/* Badge Header Bar */}
              <div className="h-14 bg-gradient-to-r from-primary to-accent flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h3 className="text-white font-bold tracking-widest text-sm uppercase flex items-center gap-2">
                  <Activity size={16} /> NephroSasa
                </h3>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-xl flex items-center justify-center shadow-inner border border-primary/20 dark:border-primary/30">
                    <User size={32} className="text-primary" />
                  </div>
                  
                  {/* Status */}
                  <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-md border border-green-200 dark:border-green-800 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle size={12} /> Active
                  </div>
                </div>

                {/* Patient Details */}
                <div className="space-y-1 mb-6">
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Patient Name</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                    {user?.first_name} {user?.last_name}
                  </p>
                </div>

                {/* Barcode/ID Area */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1 mb-2 opacity-60 dark:opacity-40">
                    {/* Simulated barcode bars */}
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className={`h-8 bg-gray-800 dark:bg-white rounded-full ${i % 3 === 0 ? 'w-1' : i % 2 === 0 ? 'w-2' : 'w-0.5'}`}></div>
                    ))}
                  </div>
                  <p className="font-mono font-bold tracking-[0.2em] text-gray-700 dark:text-gray-300">
                    NSR-{user?.id || '28471'}
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