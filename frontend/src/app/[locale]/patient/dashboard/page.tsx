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
  ArrowRight
} from 'lucide-react';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

/**
 * PATIENT DASHBOARD PAGE
 * Shows overview of patient's health data, recent activity, and quick actions
 */

interface DashboardStats {
  totalVisits: number;
  activeMedications: number;
  chronicConditions: number;
  pendingAlerts: number;
}

interface RecentVisit {
  id: number;
  date: string;
  facility: string;
  doctor: string;
  diagnosis: string;
  status: 'completed' | 'pending';
}

interface HealthAlert {
  id: number;
  type: 'warning' | 'info' | 'danger';
  message: string;
  date: string;
}

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Mock data - will be replaced with API calls when backend is ready
  const [stats, setStats] = useState<DashboardStats>({
    totalVisits: 12,
    activeMedications: 3,
    chronicConditions: 1,
    pendingAlerts: 2,
  });

  const [recentVisits, setRecentVisits] = useState<RecentVisit[]>([
    {
      id: 1,
      date: '2025-01-15',
      facility: 'King Faisal Hospital',
      doctor: 'Dr. Grace Mukamana',
      diagnosis: 'Annual checkup - All clear',
      status: 'completed',
    },
    {
      id: 2,
      date: '2025-01-10',
      facility: 'Polyclinique du Plateau',
      doctor: 'Dr. Jean-Paul Nsengimana',
      diagnosis: 'Hypertension follow-up',
      status: 'completed',
    },
    {
      id: 3,
      date: '2025-01-05',
      facility: 'Legacy Clinics Kimironko',
      doctor: 'Dr. Sarah Uwimana',
      diagnosis: 'General consultation',
      status: 'completed',
    },
  ]);

  const [healthAlerts, setHealthAlerts] = useState<HealthAlert[]>([
    {
      id: 1,
      type: 'warning',
      message: 'Blood pressure trending upward over last 3 visits. Schedule follow-up.',
      date: '2025-01-18',
    },
    {
      id: 2,
      type: 'info',
      message: 'Annual checkup due next month. Book appointment now.',
      date: '2025-01-17',
    },
  ]);

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/en/login');
      return;
    }

    const currentUser = getCurrentUser();
    if (currentUser?.user_type !== 'PATIENT') {
      router.push('/en/provider/dashboard'); // Redirect if provider
      return;
    }

    setUser(currentUser);
    setLoading(false);

    // TODO: Fetch real data from API
    // fetchDashboardData();
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {user?.first_name}!
              </h1>
              <p className="text-white/90 text-lg">
                Here's your health overview for today
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={18} />
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Visits */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Visits</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.totalVisits}</h3>
                <p className="text-sm text-success mt-2 flex items-center gap-1">
                  <TrendingUp size={16} />
                  <span>This year</span>
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Activity size={24} className="text-primary" />
              </div>
            </div>
          </Card>

          {/* Active Medications */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Medications</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.activeMedications}</h3>
                <p className="text-sm text-gray-500 mt-2">Currently taking</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
                <FileText size={24} className="text-accent" />
              </div>
            </div>
          </Card>

          {/* Chronic Conditions */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Chronic Conditions</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.chronicConditions}</h3>
                <p className="text-sm text-gray-500 mt-2">Being managed</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-xl group-hover:bg-warning/20 transition-colors">
                <AlertCircle size={24} className="text-warning" />
              </div>
            </div>
          </Card>

          {/* Pending Alerts */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Health Alerts</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.pendingAlerts}</h3>
                <p className="text-sm text-danger mt-2">Needs attention</p>
              </div>
              <div className="p-3 bg-danger/10 rounded-xl group-hover:bg-danger/20 transition-colors">
                <Bell size={24} className="text-danger" />
              </div>
            </div>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Health Alerts */}
            {healthAlerts.length > 0 && (
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Bell size={24} className="text-primary" />
                    <h2 className="text-xl font-bold text-gray-900">Health Alerts</h2>
                  </div>
                  <Link href="/en/patient/records">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {healthAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        alert.type === 'danger'
                          ? 'bg-red-50 border-danger'
                          : alert.type === 'warning'
                          ? 'bg-yellow-50 border-warning'
                          : 'bg-blue-50 border-primary'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle
                          size={20}
                          className={
                            alert.type === 'danger'
                              ? 'text-danger'
                              : alert.type === 'warning'
                              ? 'text-warning'
                              : 'text-primary'
                          }
                        />
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{alert.message}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(alert.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Recent Visits */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock size={24} className="text-primary" />
                  <h2 className="text-xl font-bold text-gray-900">Recent Visits</h2>
                </div>
                <Link href="/en/patient/records">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {recentVisits.map((visit) => (
                  <div
                    key={visit.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin size={16} className="text-primary" />
                          <h3 className="font-semibold text-gray-900">{visit.facility}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <User size={14} />
                          <span>{visit.doctor}</span>
                        </div>
                        <p className="text-sm text-gray-700">{visit.diagnosis}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(visit.date).toLocaleDateString('en-RW', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                            visit.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          <CheckCircle size={12} />
                          {visit.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link href="/en/patient/qr-code">
                  <Button variant="primary" size="lg" fullWidth className="group justify-between">
                    <span className="flex items-center gap-2">
                      <QrCode size={20} />
                      My QR Code
                    </span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link href="/en/patient/records">
                  <Button variant="outline" size="lg" fullWidth className="group justify-between">
                    <span className="flex items-center gap-2">
                      <FileText size={20} />
                      Medical Records
                    </span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link href="/en/patient/payments">
                  <Button variant="outline" size="lg" fullWidth className="group justify-between">
                    <span className="flex items-center gap-2">
                      <CreditCard size={20} />
                      Payment History
                    </span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link href="/en/patient/profile">
                  <Button variant="outline" size="lg" fullWidth className="group justify-between">
                    <span className="flex items-center gap-2">
                      <User size={20} />
                      Edit Profile
                    </span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Profile Summary Card */}
            <Card>
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                </div>
                <h3 className="font-bold text-lg text-gray-900">
                  {user?.first_name} {user?.last_name}
                </h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-600">{user?.phone_number}</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium text-gray-900">Jan 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Patient ID</span>
                    <span className="font-medium text-gray-900">HVR-{user?.id}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Health Tips Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-primary">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Activity size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Health Tip of the Day</h3>
                  <p className="text-sm text-gray-700">
                    Drink at least 8 glasses of water daily. Proper hydration helps maintain healthy blood pressure and kidney function.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}