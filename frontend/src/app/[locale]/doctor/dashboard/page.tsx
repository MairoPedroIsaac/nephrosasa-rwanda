'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  ScanLine,
  Users,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import apiClient from '@/lib/api';
import ZoomImage from '@/components/motion/ZoomImage';

interface DoctorData {
  full_name: string;
  rmdc_number: string;
  specialty: string;
  phone_number: string;
  is_verified: boolean;
  total_patients: number;
  recent_alerts: any[];
  upcoming_consultations_today: number;
}

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

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

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/en/login');
      return;
    }
    const currentUser = getCurrentUser();
    const isDoctor = currentUser?.role === 'doctor' || currentUser?.user_type === 'DOCTOR';
    if (!isDoctor) {
      router.push('/en/patient/dashboard');
      return;
    }
    setUser(currentUser);
    fetchDoctorData().finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-primary dark:border-white/10 dark:border-t-primary" />
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const lastName = doctorData?.full_name?.split(' ').pop() || user?.last_name;
  const alerts = doctorData?.recent_alerts ?? [];
  const stats = [
    { label: 'Total Patients', value: doctorData?.total_patients || 0, href: '/en/doctor/patients', tone: 'text-white' },
    { label: 'Unread Alerts', value: alerts.length, href: '#alerts', tone: alerts.length ? 'text-amber-300' : 'text-white' },
    { label: 'Consultations Today', value: doctorData?.upcoming_consultations_today || 0, href: '/en/doctor/schedule', tone: 'text-primary-light' },
  ];

  return (
    <div className="pb-16">
      {/* Page header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <p translate="no" className="notranslate font-mono text-xs uppercase tracking-[0.14em] text-gray-500">
            {new Date().toLocaleDateString('en-RW', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-extrabold tracking-tightest text-gray-900 dark:text-white">
            {greeting()}, Dr. {lastName}.
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Managing {doctorData?.specialty || 'Nephrology'} practice at NephroSasa.</p>
        </div>
        <Link
          href="/en/doctor/scan-qr"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_14px_30px_-12px_rgba(59,130,246,0.7)]"
        >
          <ScanLine size={18} />
          Scan Patient QR
        </Link>
      </header>

      {/* Verification */}
      {!doctorData?.is_verified && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-400/20 dark:bg-amber-400/10">
            <ShieldAlert size={20} className="mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-300" />
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-200">Verification Pending</p>
              <p className="mt-0.5 text-sm text-amber-800/80 dark:text-amber-200/70">
                Your RMDC number is currently being verified. You will not be able to accept new patients or issue prescriptions until verification is complete.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Practice overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 relative overflow-hidden rounded-3xl bg-ink text-white dark:ring-1 dark:ring-white/10">
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
          <div className="relative p-6 sm:p-8">
            <p translate="no" className="notranslate font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">Practice Overview</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 border-t border-white/10">
              {stats.map((s, i) => (
                <Link key={s.label} href={s.href} className={`group py-5 sm:py-6 ${i > 0 ? 'border-t sm:border-t-0 sm:border-l border-white/10 sm:pl-6' : 'sm:pr-6'}`}>
                  <p className={`font-display text-5xl font-bold tracking-tight tabular ${s.tone}`}>{s.value}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-white/60 group-hover:text-white transition-colors">
                    {s.label}
                    <ArrowUpRight size={14} className="opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl bg-white/[0.05] p-5">
              <div className="flex-1">
                <p className="font-semibold">Access Patient Records</p>
                <p className="mt-1 text-sm text-white/60">
                  Scan a patient&apos;s NephroSasa QR code or enter their ID to view their full medical history and recent vitals.
                </p>
              </div>
              <Link href="/en/doctor/scan-qr" className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5">
                Scan Patient QR <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Provider card */}
        <section className="relative overflow-hidden rounded-3xl text-white min-h-[320px] flex flex-col">
          <ZoomImage src="/images/doctors/doctor-3.jpg" alt="" className="absolute inset-0" from={1.06} sizes="(max-width: 1280px) 100vw, 33vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/10" />
          <div className="relative flex items-center justify-between p-6">
            <p translate="no" className="notranslate font-mono text-[11px] uppercase tracking-[0.14em] text-white/80">NephroSasa Provider</p>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${doctorData?.is_verified ? 'bg-emerald-400/20 text-emerald-200' : 'bg-amber-400/20 text-amber-200'}`}>
              {doctorData?.is_verified ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
              {doctorData?.is_verified ? 'Verified' : 'Pending'}
            </span>
          </div>
          <div className="relative mt-auto p-6">
            <p className="font-display text-2xl font-bold leading-tight">Dr. {doctorData?.full_name || `${user?.first_name ?? ''} ${user?.last_name ?? ''}`}</p>
            <p className="mt-1 text-primary-light font-medium">{doctorData?.specialty || 'Nephrology'}</p>
            <p translate="no" className="notranslate mt-4 font-mono text-sm tracking-widest text-white/70">RMDC {(doctorData?.rmdc_number || 'N/A').replace(/^RMDC[-\s]*/i, '')}</p>
          </div>
        </section>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Alerts */}
        <section id="alerts" className="xl:col-span-2 rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900">
          <div className="flex items-center justify-between gap-4 px-6 pt-6 pb-4">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">Recent Patient Alerts</h2>
            <Link href="/en/doctor/patients" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              View All <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
          {alerts.length === 0 ? (
            <div className="mx-6 mb-6 flex items-center gap-4 rounded-2xl bg-emerald-50 p-5 dark:bg-emerald-400/10">
              <CheckCircle size={22} className="flex-shrink-0 text-emerald-600 dark:text-emerald-300" />
              <div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-200">All clear!</p>
                <p className="text-sm text-emerald-800/80 dark:text-emerald-200/70">No critical alerts from your patients.</p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-white/5 border-t border-gray-100 dark:border-white/5">
              {alerts.map((a: any, i: number) => {
                const high = String(a?.risk_level ?? a?.ai_risk_score ?? a?.severity ?? '').toUpperCase() === 'HIGH';
                return (
                  <li key={a?.id ?? i} className="flex items-center gap-4 px-6 py-4">
                    <span className={`h-9 w-1 rounded-full ${high ? 'bg-red-500' : 'bg-amber-400'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900 dark:text-white">{a?.patient_name ?? a?.patient ?? 'Patient'}</p>
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">{a?.message ?? a?.title ?? 'New reading needs review'}</p>
                    </div>
                    {a?.created_at && (
                      <span className="font-mono text-xs text-gray-400">{new Date(a.created_at).toLocaleDateString('en-RW', { day: 'numeric', month: 'short' })}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Quick actions */}
        <section className="rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900 p-2">
          <h2 className="px-4 pt-4 pb-2 font-display text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
          {[
            { href: '/en/doctor/prescriptions', icon: FileText, title: 'Write Prescription', sub: 'Issue and track prescriptions' },
            { href: '/en/doctor/patients', icon: Users, title: 'My Patients', sub: 'Readings and risk for everyone you follow' },
            { href: '/en/doctor/schedule', icon: Calendar, title: 'Schedule', sub: 'Today and upcoming consultations' },
          ].map((a) => (
            <Link key={a.href} href={a.href} className="group flex items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.04]">
              <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <a.icon size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-gray-900 dark:text-white">{a.title}</span>
                <span className="block text-sm text-gray-500 dark:text-gray-400">{a.sub}</span>
              </span>
              <ArrowRight size={17} className="text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-primary dark:text-gray-600" />
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
