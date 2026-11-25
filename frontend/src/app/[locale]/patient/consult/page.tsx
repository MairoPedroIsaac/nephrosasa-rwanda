'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Video, MapPin, Clock, CheckCircle, AlertCircle, ArrowRight, Check } from 'lucide-react';
import { isAuthenticated } from '@/lib/auth';
import apiClient from '@/lib/api';

const isVirtual = (t: string) => String(t).toLowerCase() === 'virtual';

const statusStyle = (status: string) => {
  const s = status.toLowerCase();
  if (s === 'confirmed') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300';
  if (s === 'cancelled') return 'bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300';
  if (s === 'completed') return 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400';
  return 'bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300';
};

const dateParts = (iso: string) => {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString('en-GB', { day: '2-digit' }),
    month: d.toLocaleDateString('en-GB', { month: 'short' }),
    full: d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }),
  };
};

const initials = (name: string) =>
  (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

export default function ConsultPage() {
  const router = useRouter();
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingConsultations, setLoadingConsultations] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    consultation_type: 'virtual',
    doctor_id: '',
    scheduled_date: '',
    scheduled_time: '',
    notes: '',
  });

  const timeSlots = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/en/login');
      return;
    }
    fetchDoctors();
    fetchConsultations();
  }, [router]);

  const fetchDoctors = async () => {
    try {
      const response = await apiClient.get('/doctors/available/');
      setDoctors(response.data);
      if (response.data.length > 0) {
        setFormData((prev) => ({ ...prev, doctor_id: response.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch doctors', err);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const fetchConsultations = async () => {
    try {
      const response = await apiClient.get('/consultations/my/');
      setConsultations(response.data);
    } catch (err) {
      console.error('Failed to fetch consultations', err);
    } finally {
      setLoadingConsultations(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    if (!formData.doctor_id) {
      setErrorMsg('Please select a doctor.');
      setSubmitLoading(false);
      return;
    }
    if (!formData.scheduled_time) {
      setErrorMsg('Please pick a time.');
      setSubmitLoading(false);
      return;
    }

    try {
      await apiClient.post('/consultations/book/', formData);
      setSuccessMsg('Consultation request sent! Your doctor will confirm your appointment.');
      setFormData({
        consultation_type: 'virtual',
        doctor_id: doctors.length > 0 ? doctors[0].id : '',
        scheduled_date: '',
        scheduled_time: '',
        notes: '',
      });
      fetchConsultations();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to book consultation. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  // Next upcoming appointment gets the spotlight
  const upcoming = consultations
    .filter((c) => !['cancelled', 'completed'].includes(String(c.status).toLowerCase()) && c.scheduled_date >= today)
    .sort((a, b) => String(a.scheduled_date).localeCompare(String(b.scheduled_date)));
  const next = upcoming[0];
  const rest = consultations.filter((c) => c !== next);

  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2';
  const field =
    'w-full px-4 py-3 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors';

  return (
    <div className="pb-16">
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-gray-500">Consultancy</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl font-extrabold tracking-tightest text-gray-900 dark:text-white">Consultations</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Book and manage your appointments with verified nephrologists.</p>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 xl:grid-cols-[1.15fr_1fr] gap-6 items-start">
        {/* Booking */}
        <section className="rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Book a Consultation</h2>

          {successMsg && (
            <div className="mt-5 flex gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200">
              <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm">{successMsg}</p>
            </div>
          )}
          {errorMsg && (
            <div className="mt-5 flex gap-3 rounded-2xl bg-red-50 p-4 text-red-800 dark:bg-red-400/10 dark:text-red-200">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-7">
            {/* Type */}
            <fieldset>
              <legend className={label}>Consultation Type</legend>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: 'virtual', icon: Video, t: 'Virtual Session', s: 'Video call from home' },
                  { v: 'in_person', icon: MapPin, t: 'In-Person Visit', s: 'At the clinic in Kigali' },
                ].map((o) => {
                  const on = formData.consultation_type === o.v;
                  return (
                    <button
                      key={o.v}
                      type="button"
                      onClick={() => setFormData({ ...formData, consultation_type: o.v })}
                      aria-pressed={on}
                      className={`relative rounded-2xl border p-4 text-left transition-all ${
                        on ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300 dark:border-white/10 dark:hover:border-white/20'
                      }`}
                    >
                      <o.icon size={20} className={on ? 'text-primary' : 'text-gray-400'} />
                      <span className="mt-3 block font-semibold text-gray-900 dark:text-white">{o.t}</span>
                      <span className="block text-sm text-gray-500 dark:text-gray-400">{o.s}</span>
                      {on && (
                        <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-primary text-white">
                          <Check size={12} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Doctor */}
            <fieldset>
              <legend className={label}>Select Nephrologist *</legend>
              {loadingDoctors ? (
                <div className="h-16 animate-pulse rounded-2xl bg-gray-100 dark:bg-white/5" />
              ) : doctors.length === 0 ? (
                <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-400/10 dark:text-amber-200">
                  No verified nephrologists available yet. Check back soon.
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {doctors.map((d: any) => {
                    const on = String(formData.doctor_id) === String(d.id);
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, doctor_id: d.id })}
                        aria-pressed={on}
                        className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                          on ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300 dark:border-white/10 dark:hover:border-white/20'
                        }`}
                      >
                        <span className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-full text-sm font-semibold ${on ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300'}`}>
                          {initials(d.full_name)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span translate="no" className="notranslate block truncate font-semibold text-gray-900 dark:text-white">Dr. {d.full_name}</span>
                          <span translate="no" className="notranslate block truncate font-mono text-xs text-gray-500">{d.rmdc_number}</span>
                        </span>
                        <span className={`grid h-5 w-5 place-items-center rounded-full border ${on ? 'border-primary bg-primary text-white' : 'border-gray-300 dark:border-white/20'}`}>
                          {on && <Check size={12} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </fieldset>

            {/* Date */}
            <div>
              <label htmlFor="date" className={label}>Preferred Date *</label>
              <input
                type="date"
                id="date"
                min={today}
                value={formData.scheduled_date}
                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                className={field}
                required
              />
            </div>

            {/* Time */}
            <fieldset>
              <legend className={label}>Preferred Time *</legend>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {timeSlots.map((slot) => {
                  const on = formData.scheduled_time === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFormData({ ...formData, scheduled_time: slot })}
                      aria-pressed={on}
                      className={`rounded-xl border py-2.5 font-mono text-sm transition-all ${
                        on
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 text-gray-700 hover:border-gray-400 dark:border-white/10 dark:text-gray-300 dark:hover:border-white/30'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className={label}>Notes (Optional)</label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Describe your symptoms or reason for consultation..."
                className={field}
              />
            </div>

            <button
              type="submit"
              disabled={submitLoading || doctors.length === 0}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:translate-y-0 dark:disabled:bg-white/10"
            >
              {submitLoading ? 'Booking...' : 'Book Consultation'}
              {!submitLoading && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
            </button>
          </form>
        </section>

        {/* My consultations */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">My Consultations</h2>

          {loadingConsultations ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-3xl bg-gray-100 dark:bg-white/5" />
              ))}
            </div>
          ) : consultations.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 p-8 text-center dark:border-white/10">
              <p className="font-medium text-gray-700 dark:text-gray-300">No consultations booked yet.</p>
              <p className="mt-1 text-sm text-gray-500">Your appointments will appear here once you book one.</p>
            </div>
          ) : (
            <>
              {next && (
                <div className="relative overflow-hidden rounded-3xl bg-ink p-6 text-white dark:ring-1 dark:ring-white/10">
                  <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:36px_36px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
                  <div className="relative">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">Next appointment</p>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyle(String(next.status || 'pending'))}`}>{next.status || 'pending'}</span>
                    </div>
                    <p className="mt-4 font-display text-3xl font-bold tracking-tight">{dateParts(next.scheduled_date).full}</p>
                    <p translate="no" className="notranslate mt-1 font-mono text-lg text-primary-light">{next.scheduled_time}</p>
                    <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-sm font-semibold">{initials(next.doctor_name)}</span>
                      <div className="min-w-0 flex-1">
                        <p translate="no" className="notranslate truncate font-semibold">Dr. {next.doctor_name}</p>
                        <p className="flex items-center gap-1.5 text-sm text-white/60">
                          {isVirtual(next.consultation_type) ? <Video size={14} /> : <MapPin size={14} />}
                          {isVirtual(next.consultation_type) ? 'Virtual Session' : 'In-Person Visit'}
                        </p>
                      </div>
                      {String(next.status).toLowerCase() === 'confirmed' && next.session_link && (
                        <a href={next.session_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5">
                          <Video size={15} /> Join Meeting
                        </a>
                      )}
                    </div>
                    {next.notes && <p className="mt-4 text-sm text-white/60">&ldquo;{next.notes}&rdquo;</p>}
                  </div>
                </div>
              )}

              {rest.length > 0 && (
                <ul className="divide-y divide-gray-100 overflow-hidden rounded-3xl border border-gray-200 bg-white dark:divide-white/5 dark:border-white/10 dark:bg-gray-900">
                  {rest.map((c: any) => {
                    const dp = dateParts(c.scheduled_date);
                    const status = String(c.status || 'pending');
                    return (
                      <li key={c.id} className="flex items-center gap-4 p-4 sm:p-5">
                        <div className="w-14 flex-shrink-0 rounded-2xl bg-gray-50 py-2 text-center dark:bg-white/5">
                          <p className="font-display text-xl font-bold leading-none text-gray-900 dark:text-white">{dp.day}</p>
                          <p className="mt-1 font-mono text-[11px] uppercase text-gray-500">{dp.month}</p>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p translate="no" className="notranslate truncate font-semibold text-gray-900 dark:text-white">Dr. {c.doctor_name}</p>
                          <p className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {isVirtual(c.consultation_type) ? <Video size={13} /> : <MapPin size={13} />}
                            {isVirtual(c.consultation_type) ? 'Virtual' : 'In-Person'}
                            <span className="text-gray-300 dark:text-gray-600">·</span>
                            <Clock size={13} />
                            <span translate="no" className="notranslate font-mono">{c.scheduled_time}</span>
                          </p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyle(status)}`}>{status}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
