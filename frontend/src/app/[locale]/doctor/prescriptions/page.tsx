'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, ArrowRight, Users, ScanLine } from 'lucide-react';
import apiClient from '@/lib/api';

interface Patient {
  patient_name: string;
  risk_level: string | null;
  share_token: string;
}

const riskDot = (r: string | null) =>
  r === 'HIGH' ? 'bg-red-500' : r === 'MEDIUM' ? 'bg-amber-400' : r === 'LOW' ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600';

const initials = (name: string) =>
  (name || '?').split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

export default function DoctorPrescriptionsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/doctor/my-patients/')
      .then((res) => setPatients(res.data))
      .catch((err) => console.error('Failed to fetch patients', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pb-16">
      <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-gray-500">Doctor portal</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl font-extrabold tracking-tightest text-gray-900 dark:text-white">Prescriptions</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Manage and issue prescriptions for your patients.</p>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
        {/* Empty state */}
        <section className="relative overflow-hidden rounded-3xl bg-ink p-8 sm:p-10 text-white dark:ring-1 dark:ring-white/10">
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
          <div className="relative">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-primary-light">
              <FileText size={26} />
            </span>
            <h2 className="mt-8 font-display text-3xl sm:text-4xl font-bold tracking-tight">No prescriptions issued yet.</h2>
            <p className="mt-3 max-w-md text-white/60">
              You can write prescriptions for patients once they appear in your My Patients list.
            </p>
            <Link
              href="/en/doctor/patients"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-ink transition-transform hover:-translate-y-0.5"
            >
              Write New Prescription
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        {/* Patients to prescribe for */}
        <section className="rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900">
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">My Patients</h2>
            <span className="font-mono text-xs text-gray-400">{loading ? '' : patients.length}</span>
          </div>
          {loading ? (
            <div className="px-6 pb-6 space-y-3">
              {[0, 1].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-2xl bg-gray-100 dark:bg-white/5" />
              ))}
            </div>
          ) : patients.length === 0 ? (
            <div className="px-6 pb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                When a patient shares their QR code with you and you scan it, their record will appear here.
              </p>
              <Link href="/en/doctor/scan-qr" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <ScanLine size={16} /> Scan Patient QR
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 border-t border-gray-100 dark:divide-white/5 dark:border-white/5">
              {patients.map((p) => (
                <li key={p.share_token || p.patient_name}>
                  <Link href={p.share_token ? `/en/shared-record/${p.share_token}` : '/en/doctor/patients'} className="group flex items-center gap-3 px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.03]">
                    <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {initials(p.patient_name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span translate="no" className="notranslate block truncate font-medium text-gray-900 dark:text-white">{p.patient_name}</span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <span className={`h-1.5 w-1.5 rounded-full ${riskDot(p.risk_level)}`} />
                        {p.risk_level ? `${p.risk_level.charAt(0)}${p.risk_level.slice(1).toLowerCase()} risk` : 'No readings yet'}
                      </span>
                    </span>
                    <ArrowRight size={16} className="text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-primary dark:text-gray-600" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-gray-100 px-6 py-4 dark:border-white/5">
            <Link href="/en/doctor/patients" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              <Users size={15} /> View all patients
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
