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
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

/**
 * PATIENT DASHBOARD PAGE
 * Shows overview of patient's health data, AI kidney risk score, and quick actions
 */

interface VitalsRecord {
  id: number;
  date: string;
  systolicBP: number;
  diastolicBP: number;
  bloodSugar: number;
}

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Mock data for vitals history
  const [recentVitals, setRecentVitals] = useState<VitalsRecord[]>([
    {
      id: 1,
      date: '2025-10-15T08:30:00Z',
      systolicBP: 135,
      diastolicBP: 88,
      bloodSugar: 6.2,
    },
    {
      id: 2,
      date: '2025-10-14T09:15:00Z',
      systolicBP: 142,
      diastolicBP: 90,
      bloodSugar: 6.5,
    },
    {
      id: 3,
      date: '2025-10-13T07:45:00Z',
      systolicBP: 138,
      diastolicBP: 85,
      bloodSugar: 6.1,
    },
  ]);

  // Vitals form state
  const [vitalsForm, setVitalsForm] = useState({
    systolicBP: '',
    diastolicBP: '',
    bloodSugar: '',
  });

  const handleVitalsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to the backend API
    alert('Vitals logged successfully. Your AI Kidney Risk Score will be updated shortly.');
    setVitalsForm({ systolicBP: '', diastolicBP: '', bloodSugar: '' });
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
    setLoading(false);
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
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Modernized Floating Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="bg-gradient-to-br from-primary via-primary-dark to-accent text-white rounded-3xl p-8 shadow-2xl shadow-primary/20 relative overflow-hidden">
          {/* Decorative glass elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent opacity-20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                Welcome back, {user?.first_name}!
              </h1>
              <p className="text-white/90 text-lg font-medium">
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
          <Card className="border-t-4 border-warning shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity size={120} />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="text-warning" size={28} />
                AI Kidney Risk Score
              </h2>
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Current Assessment</p>
                  <h3 className="text-4xl font-extrabold text-warning tracking-tight">MEDIUM RISK</h3>
                  <p className="text-sm font-medium text-gray-500 mt-2">Confidence: 53%</p>
                </div>
                
                {/* Visual Indicator */}
                <div className="w-24 h-24 rounded-full border-8 border-warning flex items-center justify-center bg-warning/10">
                  <TrendingUp className="text-warning" size={32} />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                <h4 className="font-semibold text-yellow-800 flex items-center gap-2 mb-2">
                  <AlertCircle size={18} />
                  Action Required
                </h4>
                <p className="text-sm text-yellow-700 leading-relaxed">
                  Your recent blood pressure trends indicate a moderate risk for kidney function decline. Please maintain your prescribed medication and schedule a remote consultation with your nephrologist.
                </p>
              </div>

              {/* Required Medical Disclaimer */}
              <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-500 italic leading-tight">
                  <span className="font-semibold">Medical Disclaimer:</span> This AI-generated risk score is a screening tool based on the data you provided. It is NOT a clinical diagnosis. Always consult your registered healthcare provider before making any medical decisions.
                </p>
              </div>
            </div>
          </Card>

          {/* Log Vitals Form */}
          <Card className="shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <HeartPulse className="text-primary" size={28} />
              Log Your Vitals
            </h2>
            <p className="text-gray-600 mb-6">
              Enter your daily readings to update your AI predictive model.
            </p>

            <form onSubmit={handleVitalsSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="systolicBP" className="block text-sm font-medium text-gray-700 mb-2">
                    Systolic BP (mmHg)
                  </label>
                  <input
                    id="systolicBP"
                    type="number"
                    value={vitalsForm.systolicBP}
                    onChange={(e) => setVitalsForm({ ...vitalsForm, systolicBP: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                    placeholder="e.g. 120"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="diastolicBP" className="block text-sm font-medium text-gray-700 mb-2">
                    Diastolic BP (mmHg)
                  </label>
                  <input
                    id="diastolicBP"
                    type="number"
                    value={vitalsForm.diastolicBP}
                    onChange={(e) => setVitalsForm({ ...vitalsForm, diastolicBP: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                    placeholder="e.g. 80"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bloodSugar" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Droplet size={16} className="text-red-500" />
                  Fasting Blood Sugar (mmol/L)
                </label>
                <input
                  id="bloodSugar"
                  type="number"
                  step="0.1"
                  value={vitalsForm.bloodSugar}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, bloodSugar: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                  placeholder="e.g. 5.5"
                  required
                />
              </div>

              <Button type="submit" variant="primary" fullWidth size="lg" className="mt-4">
                Save Readings & Update Score
              </Button>
            </form>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Vitals History */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock size={24} className="text-primary" />
                  <h2 className="text-xl font-bold text-gray-900">Recent Vitals History</h2>
                </div>
                <Link href="/en/patient/records">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="p-3 text-sm font-semibold text-gray-600 rounded-tl-lg">Date & Time</th>
                      <th className="p-3 text-sm font-semibold text-gray-600">Blood Pressure</th>
                      <th className="p-3 text-sm font-semibold text-gray-600 rounded-tr-lg">Blood Sugar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentVitals.map((record) => (
                      <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-3">
                          <p className="font-medium text-gray-900">
                            {new Date(record.date).toLocaleDateString('en-RW', { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(record.date).toLocaleTimeString('en-RW', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                            record.systolicBP > 140 || record.diastolicBP > 90
                              ? 'bg-red-100 text-red-800'
                              : record.systolicBP > 130 || record.diastolicBP > 85
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {record.systolicBP} / {record.diastolicBP} mmHg
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-700 font-medium">
                          {record.bloodSugar} mmol/L
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link href="#">
                  <Button variant="primary" size="lg" fullWidth className="group justify-between">
                    <span className="flex items-center gap-2">
                      <User size={20} />
                      Consult Nephrologist
                    </span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link href="/en/patient/qr-code">
                  <Button variant="outline" size="lg" fullWidth className="group justify-between bg-white">
                    <span className="flex items-center gap-2">
                      <QrCode size={20} />
                      Share QR Health Record
                    </span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link href="/en/patient/payments">
                  <Button variant="outline" size="lg" fullWidth className="group justify-between bg-white">
                    <span className="flex items-center gap-2">
                      <CreditCard size={20} />
                      Mobile Money Payments
                    </span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Patient ID</p>
                <p className="font-mono font-bold text-lg text-gray-900 tracking-wider bg-gray-100 py-2 rounded-lg">
                  NSR-{user?.id || '28471'}
                </p>
              </div>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}