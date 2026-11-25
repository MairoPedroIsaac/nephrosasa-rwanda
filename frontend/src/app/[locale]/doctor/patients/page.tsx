'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, ScanLine, ArrowRight, Search } from 'lucide-react';
import apiClient from '@/lib/api';

interface Patient {
  patient_name: string;
  email: string;
  risk_level: string | null;
  added_at: string;
  share_token: string;
}

const RISK: Record<string, { label: string; dot: string; pill: string }> = {
  HIGH: { label: 'High risk', dot: 'bg-red-500', pill: 'bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300' },
  MEDIUM: { label: 'Moderate risk', dot: 'bg-amber-400', pill: 'bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-200' },
  LOW: { label: 'Low risk', dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200' },
};
const NO_DATA = { label: 'No readings yet', dot: 'bg-gray-300 dark:bg-gray-600', pill: 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400' };

const initials = (name: string) =>
  (name || '?').split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

/** Rows open the shared record. A patient with no active share token gets a plain row, never a broken link. */
function RowLink({ href, className, children }: { href: string | null; className: string; children: React.ReactNode }) {
  if (href) return <Link href={href} className={`${className} hover:bg-gray-50 dark:hover:bg-white/[0.03]`}>{children}</Link>;
  return <div className={className}>{children}</div>;
}

export default function DoctorPatientsPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');

  const fetchPatients = async () => {
    setError(false);
    setLoading(true);
    try {
      const response = await apiClient.get('/doctor/my-patients/');
      setPatients(response.data);
    } catch (err) {
      console.error('Failed to fetch patients', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const shown = patients.filter((p) =>
    `${p.patient_name} ${p.email}`.toLowerCase().includes(query.trim().toLowerCase())
  );
  const counts = {
    HIGH: patients.filter((p) => p.risk_level === 'HIGH').length,
    MEDIUM: patients.filter((p) => p.risk_level === 'MEDIUM').length,
    LOW: patients.filter((p) => p.risk_level === 'LOW').length,
  };

  return (
    <div className="pb-16">
      <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-gray-500">Doctor portal</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-extrabold tracking-tightest text-gray-900 dark:text-white">My Patients</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Patients who have shared their health records with you.</p>
        </div>
        <Link
          href={`/${locale}/doctor/scan-qr`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-primary-dark"
        >
          <ScanLine size={18} /> Scan Patient
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="mt-8 space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100 dark:bg-white/5" />
            ))}
          </div>
        ) : error ? (
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-10 text-center dark:border-white/10 dark:bg-gray-900">
            <p className="text-red-600 dark:text-red-300">Failed to load patients. Please try again.</p>
            <button onClick={fetchPatients} className="mt-4 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold dark:border-white/10 dark:text-white">
              Retry
            </button>
          </div>
        ) : patients.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-gray-900">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Users size={24} />
            </span>
            <h2 className="mt-5 font-display text-2xl font-bold text-gray-900 dark:text-white">No patients yet.</h2>
            <p className="mx-auto mt-2 max-w-md text-gray-500 dark:text-gray-400">
              When a patient shares their QR code with you and you scan it, their record will appear here.
            </p>
            <Link href={`/${locale}/doctor/scan-qr`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold text-white dark:bg-white dark:text-ink">
              <ScanLine size={17} /> Scan Patient QR Code
            </Link>
          </div>
        ) : (
          <>
            {/* Risk summary */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 overflow-hidden rounded-3xl bg-ink text-white dark:ring-1 dark:ring-white/10">
              {[
                { label: 'Total', value: patients.length, dot: 'bg-white/40' },
                { label: 'High risk', value: counts.HIGH, dot: 'bg-red-500' },
                { label: 'Moderate risk', value: counts.MEDIUM, dot: 'bg-amber-400' },
                { label: 'Low risk', value: counts.LOW, dot: 'bg-emerald-500' },
              ].map((s, i) => (
                <div key={s.label} className={`p-5 sm:p-6 ${i % 2 ? 'border-l border-white/10' : ''} ${i > 1 ? 'border-t sm:border-t-0 border-white/10' : ''} ${i === 2 ? 'sm:border-l' : ''}`}>
                  <p className="font-display text-4xl font-bold tracking-tight tabular">{s.value}</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-white/60">
                    <span className={`h-2 w-2 rounded-full ${s.dot}`} /> {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* List */}
            <section className="mt-6 overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900">
              <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-white/5">
                <div className="relative max-w-sm">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name or email"
                    className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>
              <ul className="divide-y divide-gray-100 dark:divide-white/5">
                {shown.map((p) => {
                  const r = (p.risk_level && RISK[p.risk_level]) || NO_DATA;
                  return (
                    <li key={p.email}>
                      <RowLink
                        href={p.share_token ? `/${locale}/shared-record/${p.share_token}` : null}
                        className="group grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1.4fr_1fr_1fr_auto] items-center gap-4 px-5 sm:px-6 py-4 transition-colors"
                      >
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-sm font-semibold text-white dark:bg-white/10">
                          {initials(p.patient_name)}
                        </span>
                        <span className="min-w-0">
                          <span translate="no" className="notranslate block truncate font-semibold text-gray-900 dark:text-white">{p.patient_name}</span>
                          <span className="block truncate text-sm text-gray-500 dark:text-gray-400">{p.email}</span>
                        </span>
                        <span className="hidden sm:block">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${r.pill}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${r.dot}`} /> {r.label}
                          </span>
                        </span>
                        <span className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
                          Added {new Date(p.added_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        {p.share_token ? (
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                            <span className="hidden md:inline">View Record</span>
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400" title="Ask the patient to share their QR code again">Not shared</span>
                        )}
                      </RowLink>
                    </li>
                  );
                })}
                {shown.length === 0 && <li className="px-6 py-10 text-center text-sm text-gray-500">No patient matches &ldquo;{query}&rdquo;.</li>}
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
