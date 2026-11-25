'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Info,
  QrCode,
  CreditCard,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  HeartPulse,
  Stethoscope,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import apiClient from '@/lib/api';
import TrendChart from '@/components/dashboard/TrendChart';

/**
 * PATIENT DASHBOARD PAGE
 * Overview of the patient's readings, AI kidney risk score, and next steps
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

const riskTone = (risk?: string) => {
  if (risk === 'HIGH') return { text: 'text-red-400', dot: 'bg-red-500', step: 3, label: 'High risk' };
  if (risk === 'LOW') return { text: 'text-emerald-400', dot: 'bg-emerald-500', step: 1, label: 'Low risk' };
  return { text: 'text-amber-400', dot: 'bg-amber-400', step: 2, label: 'Moderate risk' };
};

const bpTone = (s: number, d: number) => {
  if (s > 140 || d > 90) return { label: 'High', cls: 'text-red-600 dark:text-red-400', bar: 'bg-red-500' };
  if (s > 130 || d > 85) return { label: 'Elevated', cls: 'text-amber-600 dark:text-amber-400', bar: 'bg-amber-400' };
  return { label: 'Normal', cls: 'text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-500' };
};

const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions) => new Date(iso).toLocaleDateString('en-RW', opts);

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentVitals, setRecentVitals] = useState<VitalsRecord[]>([]);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);

  const fetchVitalsHistory = async () => {
    try {
      const response = await apiClient.get('/vitals/history/');
      setRecentVitals(response.data);
    } catch (error) {
      console.error('Failed to fetch vitals history', error);
      setRecentVitals([]);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/en/login');
      return;
    }
    const currentUser = getCurrentUser();
    if (currentUser?.user_type !== 'PATIENT') {
      router.push('/en/doctor/dashboard');
      return;
    }
    setUser(currentUser);
    fetchVitalsHistory().finally(() => setLoading(false));
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

  const latest = recentVitals[0];
  const risk = riskTone(latest?.ai_risk_score);
  // Oldest first for the chart, last 8 readings
  const chartData = [...recentVitals].slice(0, 8).reverse();
  const isNew = user?.is_first_login || !user?.last_login;

  return (
    <div className="pb-16">
      {/* Page header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <p translate="no" className="notranslate font-mono text-xs uppercase tracking-[0.14em] text-gray-500">
            {new Date().toLocaleDateString('en-RW', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-extrabold tracking-tightest text-gray-900 dark:text-white">
            {isNew ? 'Welcome to NephroSasa' : 'Welcome back'}, {user?.first_name}.
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Proactively monitoring your kidney health.</p>
        </div>
        <Link
          href="/en/patient/log-vitals"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_14px_30px_-12px_rgba(59,130,246,0.7)]"
        >
          <Plus size={18} />
          Log Vitals Now
        </Link>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Kidney risk panel */}
        <section className="xl:col-span-2 relative overflow-hidden rounded-3xl bg-ink text-white dark:ring-1 dark:ring-white/10">
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
          <div className="relative p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p translate="no" className="notranslate font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">AI Kidney Risk Assessment</p>
                {latest ? (
                  <h2 className={`mt-2 sm:mt-3 font-display text-3xl sm:text-5xl font-extrabold tracking-tightest ${risk.text}`}>{risk.label}</h2>
                ) : (
                  <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold tracking-tightest">No data available yet</h2>
                )}
              </div>
              <button
                onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                className={`grid h-9 w-9 flex-shrink-0 place-items-center rounded-full transition-colors ${isInfoExpanded ? 'bg-white text-ink' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'}`}
                title="What does this mean?"
                aria-expanded={isInfoExpanded}
              >
                <Info size={17} />
              </button>
            </div>

            {latest ? (
              <>
                <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-5 sm:gap-10 items-end">
                  <div>
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map((i) => (
                        <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= risk.step ? risk.dot : 'bg-white/10'}`} />
                      ))}
                    </div>
                    <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-wider text-white/40">
                      <span>Low</span><span>Moderate</span><span>High</span>
                    </div>
                    <p className="mt-5 text-sm text-white/60">
                      Model Confidence <span className="ml-1 font-mono text-white tabular">{latest.confidence_percentage}%</span>
                    </p>
                    <p className="mt-1 text-sm text-white/60">
                      Last reading <span className="ml-1 font-mono text-white">{fmtDate(latest.recorded_at, { day: 'numeric', month: 'short' })}</span>
                    </p>
                  </div>
                  <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-4 text-xs text-white/60">
                      <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-primary-light" />Systolic</span>
                      <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-white/50" />Diastolic</span>
                      <span className="flex items-center gap-1.5"><i className="h-px w-3 border-t border-dashed border-red-400" />140 limit</span>
                    </div>
                    <TrendChart
                      dark
                      height={150}
                      series={[
                        { label: 'Systolic', color: '#60A5FA', values: chartData.map((r) => r.systolic_bp) },
                        { label: 'Diastolic', color: 'rgba(255,255,255,0.55)', values: chartData.map((r) => r.diastolic_bp) },
                      ]}
                      threshold={{ value: 140, label: '140' }}
                      labels={chartData.length > 1 ? [fmtDate(chartData[0].recorded_at, { day: 'numeric', month: 'short' }), fmtDate(chartData[chartData.length - 1].recorded_at, { day: 'numeric', month: 'short' })] : []}
                    />
                  </div>
                </div>

                {latest.ai_risk_score !== 'LOW' && (
                  <div className={`mt-6 rounded-2xl border ${latest.ai_risk_score === 'HIGH' ? 'border-red-400/30 bg-red-500/10' : 'border-amber-400/30 bg-amber-400/10'}`}>
                    <button
                      type="button"
                      onClick={() => setIsActionOpen(!isActionOpen)}
                      aria-expanded={isActionOpen}
                      className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                    >
                      <AlertCircle size={19} className={`flex-shrink-0 ${latest.ai_risk_score === 'HIGH' ? 'text-red-300' : 'text-amber-300'}`} />
                      <span className="flex-1 font-semibold">Action Required</span>
                      <span className="text-xs text-white/50">{isActionOpen ? 'Hide' : 'Show'}</span>
                      <ChevronDown size={18} className={`text-white/60 transition-transform duration-300 ${isActionOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isActionOpen && (
                      <div className="px-4 pb-4 pl-[46px] animate-fade-up" style={{ animationDuration: '.35s' }}>
                        <p className="text-sm leading-relaxed text-white/70">
                          Your recent readings indicate a higher risk for kidney function decline. Please maintain your prescribed medication and schedule a remote consultation with your nephrologist.
                        </p>
                        <Link href="/en/patient/consult" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:gap-2.5 transition-all">
                          Consult Nephrologist <ArrowRight size={15} />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="mt-4 max-w-md">
                <p className="text-white/60">Log your first blood pressure and sugar reading to get your personalized AI risk assessment.</p>
                <Link href="/en/patient/log-vitals" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5">
                  <HeartPulse size={16} /> Log your first reading
                </Link>
              </div>
            )}

            {isInfoExpanded && (
              <p className="mt-6 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/50">
                <span className="font-semibold text-white/70">Medical Disclaimer:</span> This AI-generated risk score is a screening tool based on the data you provided. It is NOT a clinical diagnosis. Always consult your registered healthcare provider before making any medical decisions.
              </p>
            )}
          </div>
        </section>

        {/* Health ID card */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-ink-2 p-6 sm:p-7 text-white flex flex-col">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/15" />
          <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full border border-white/10" />
          <div className="relative flex items-center justify-between">
            <p translate="no" className="notranslate font-mono text-[11px] uppercase tracking-[0.14em] text-white/70">NephroSasa Health ID</p>
            <span className="rounded-full bg-white/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider">Active</span>
          </div>
          <p className="relative mt-10 font-display text-2xl font-bold leading-tight">
            {user?.first_name} {user?.last_name}
          </p>
          <p className="relative mt-1 font-mono text-lg tracking-[0.2em] text-white/80">NSR-{user?.id || '00000'}</p>
          <div className="relative mt-auto pt-8 flex items-center justify-between gap-3">
            <p className="text-sm text-white/70 max-w-[12rem]">Show your QR code at any clinic so your doctor sees your history.</p>
            <Link href="/en/patient/share-record" className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-white text-ink transition-transform hover:scale-105" aria-label="Share Health Record">
              <QrCode size={22} />
            </Link>
          </div>
        </section>
      </div>

      {/* Latest readings strip */}
      {latest && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900">
            {[
              { k: 'Blood Pressure', v: `${latest.systolic_bp}/${latest.diastolic_bp}`, u: 'mmHg', note: bpTone(latest.systolic_bp, latest.diastolic_bp) },
              { k: 'Blood Sugar', v: `${latest.blood_sugar}`, u: 'mmol/L', note: latest.blood_sugar > 7 ? { label: 'Above target', cls: 'text-amber-600 dark:text-amber-400' } : { label: 'In range', cls: 'text-emerald-600 dark:text-emerald-400' } },
              { k: 'Readings logged', v: `${recentVitals.length}`, u: 'total', note: { label: `Since ${fmtDate(recentVitals[recentVitals.length - 1].recorded_at, { month: 'short', year: 'numeric' })}`, cls: 'text-gray-500' } },
            ].map((m, i) => (
              <div key={m.k} className={`p-6 ${i > 0 ? 'border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-white/10' : ''}`}>
                <p className="text-sm text-gray-500 dark:text-gray-400">{m.k}</p>
                <p translate="no" className="notranslate mt-2 font-mono text-3xl tracking-tight text-gray-900 dark:text-white tabular">
                  {m.v}<span className="ml-1.5 text-sm text-gray-400">{m.u}</span>
                </p>
                <p className={`mt-1 text-sm font-medium ${m.note.cls}`}>{m.note.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent vitals */}
        <section className="xl:col-span-2 rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900 overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-6 pt-6 pb-4">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">Recent Vitals History</h2>
            <Link href="/en/patient/records" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              View All Records <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
          {recentVitals.length === 0 ? (
            <div className="mx-6 mb-6 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 py-12 text-center">
              <p className="font-medium text-gray-700 dark:text-gray-300">No history available</p>
              <p className="mt-1 text-sm text-gray-500">Your readings will show here after you log them.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-y border-gray-100 dark:border-white/5 bg-gray-50/70 dark:bg-white/[0.02]">
                    <th className="px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-wider text-gray-500">Date & Time</th>
                    <th className="px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-wider text-gray-500">Blood Pressure</th>
                    <th className="px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-wider text-gray-500">Blood Sugar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {recentVitals.slice(0, 6).map((record) => {
                    const t = bpTone(record.systolic_bp, record.diastolic_bp);
                    return (
                      <tr key={record.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.03]">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900 dark:text-white">{fmtDate(record.recorded_at, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          <p translate="no" className="notranslate mt-0.5 font-mono text-xs text-gray-500">{new Date(record.recorded_at).toLocaleTimeString('en-RW', { hour: '2-digit', minute: '2-digit' })}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className={`h-8 w-1 rounded-full ${t.bar}`} />
                            <div>
                              <p translate="no" className="notranslate font-mono text-gray-900 dark:text-white tabular">{record.systolic_bp}/{record.diastolic_bp} <span className="text-xs text-gray-400">mmHg</span></p>
                              <p className={`text-xs font-medium ${t.cls}`}>{t.label}</p>
                            </div>
                          </div>
                        </td>
                        <td translate="no" className="notranslate px-6 py-4 font-mono text-gray-700 dark:text-gray-300 tabular">
                          {record.blood_sugar} <span className="text-xs text-gray-400">mmol/L</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Quick actions */}
        <section className="rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900 p-2">
          <h2 className="px-4 pt-4 pb-2 font-display text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
          {[
            { href: '/en/patient/consult', icon: Stethoscope, title: 'Consult Nephrologist', sub: 'Book a remote session with a Kigali specialist' },
            { href: '/en/patient/share-record', icon: QrCode, title: 'Share Health Record', sub: 'Give a doctor access with your QR code' },
            { href: '/en/patient/payments', icon: CreditCard, title: 'Mobile Money Payments', sub: 'MTN or Airtel Money, with receipts' },
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
