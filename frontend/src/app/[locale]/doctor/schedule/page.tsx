'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, Clock, Video, MapPin, Check, Link as LinkIcon, ChevronDown } from 'lucide-react';
import { isAuthenticated } from '@/lib/auth';
import apiClient from '@/lib/api';

interface Appointment {
  id: string;
  patient_name: string;
  patient_email: string;
  scheduled_date: string;
  scheduled_time: string;
  consultation_type: string;
  status: string;
  session_link?: string;
  notes?: string;
}

type Status = 'pending' | 'confirmed' | 'completed' | 'cancelled';

const STATUS: Record<Status, { label: string; dot: string; pill: string }> = {
  pending: { label: 'Pending', dot: 'bg-amber-400', pill: 'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-200 dark:ring-amber-400/20' },
  confirmed: { label: 'Confirmed', dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-200 dark:ring-emerald-400/20' },
  completed: { label: 'Completed', dot: 'bg-gray-400', pill: 'bg-gray-100 text-gray-700 ring-gray-200 dark:bg-white/5 dark:text-gray-300 dark:ring-white/10' },
  cancelled: { label: 'Cancelled', dot: 'bg-red-500', pill: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-400/10 dark:text-red-300 dark:ring-red-400/20' },
};

const toStatus = (s: string | undefined): Status => {
  const v = (s || 'pending').toLowerCase();
  return (v in STATUS ? v : 'pending') as Status;
};

/** Combine the API's date (YYYY-MM-DD) and time (14:00 or 2:00 PM) into one Date. */
const whenOf = (a: Appointment): Date | null => {
  if (!a.scheduled_date) return null;
  const [y, m, d] = String(a.scheduled_date).split('-').map((n) => parseInt(n, 10));
  if (!y || !m || !d) return null;
  let hour = 0;
  let minute = 0;
  const match = String(a.scheduled_time || '').trim().toUpperCase().match(/(\d+):(\d+)\s*(AM|PM)?/);
  if (match) {
    hour = parseInt(match[1], 10);
    minute = parseInt(match[2], 10);
    if (match[3] === 'PM' && hour < 12) hour += 12;
    if (match[3] === 'AM' && hour === 12) hour = 0;
  }
  return new Date(y, m - 1, d, hour, minute);
};

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

const initials = (name: string) =>
  (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

const isVirtual = (t: string) => (t || '').toLowerCase().includes('virtual');

function StatusSelect({ value, onChange }: { value: Status; onChange: (s: Status) => void }) {
  const s = STATUS[value];
  return (
    <label className={`relative inline-flex items-center gap-2 rounded-full py-1.5 pl-3 pr-8 text-sm font-medium ring-1 ring-inset cursor-pointer ${s.pill}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {s.label}
      <ChevronDown size={14} className="pointer-events-none absolute right-2.5 opacity-60" />
      <select
        aria-label="Change status"
        value={value}
        onChange={(e) => onChange(e.target.value as Status)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {(Object.keys(STATUS) as Status[]).map((k) => (
          <option key={k} value={k}>{STATUS[k].label}</option>
        ))}
      </select>
    </label>
  );
}

function SessionLink({ appointment, onSave }: { appointment: Appointment; onSave: (id: string, link: string) => Promise<void> }) {
  const [value, setValue] = useState(appointment.session_link || '');
  const [editing, setEditing] = useState(!appointment.session_link);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    await onSave(appointment.id, value.trim());
    setSaving(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!editing && appointment.session_link) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={appointment.session_link}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-ink"
        >
          <Video size={15} /> Join meeting
        </a>
        <button onClick={() => setEditing(true)} className="rounded-full px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white">
          Edit link
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-300">
            <Check size={15} /> Saved
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <LinkIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste the Zoom or Google Meet link"
          className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={saving || !value.trim()}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save link'}
        </button>
        {appointment.session_link && (
          <button
            onClick={() => {
              setValue(appointment.session_link || '');
              setEditing(false);
            }}
            className="rounded-full px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

function AppointmentRow({ appointment, past, onStatus, onLink }: {
  appointment: Appointment;
  past: boolean;
  onStatus: (id: string, s: Status) => void;
  onLink: (id: string, link: string) => Promise<void>;
}) {
  const when = whenOf(appointment);
  const status = toStatus(appointment.status);
  const virtual = isVirtual(appointment.consultation_type);
  const needsWrapUp = past && (status === 'confirmed' || status === 'pending');
  const showLink = virtual && !past && status !== 'cancelled';

  return (
    <li className="p-5 sm:p-6">
      <div className="flex gap-4 sm:gap-5">
        {/* Date block */}
        <div className={`flex w-14 flex-shrink-0 flex-col items-center justify-center rounded-2xl py-2.5 ${past ? 'bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400' : 'bg-primary/10 text-primary'}`}>
          <span className="font-mono text-[10px] uppercase tracking-wider">{when ? when.toLocaleDateString('en-GB', { month: 'short' }) : '--'}</span>
          <span className="font-display text-2xl font-bold leading-none tabular">{when ? when.getDate() : '--'}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-ink text-sm font-semibold text-white dark:bg-white/10">
                {initials(appointment.patient_name)}
              </span>
              <div className="min-w-0">
                <p translate="no" className="notranslate truncate font-semibold text-gray-900 dark:text-white">{appointment.patient_name}</p>
                <p className="truncate text-sm text-gray-500 dark:text-gray-400">{appointment.patient_email}</p>
              </div>
            </div>
            <StatusSelect value={status} onChange={(s) => onStatus(appointment.id, s)} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
            <span className="inline-flex items-center gap-1.5">
              <CalendarIcon size={15} className="text-gray-400" />
              {when ? when.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : appointment.scheduled_date}
            </span>
            <span translate="no" className="notranslate inline-flex items-center gap-1.5 font-mono">
              <Clock size={15} className="text-gray-400" />
              {appointment.scheduled_time}
            </span>
            <span className="inline-flex items-center gap-1.5">
              {virtual ? <Video size={15} className="text-gray-400" /> : <MapPin size={15} className="text-gray-400" />}
              {virtual ? 'Virtual Session' : 'In-Person Visit'}
            </span>
          </div>

          {appointment.notes && !past && (
            <p className="mt-4 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:bg-white/[0.03] dark:text-gray-400">
              &ldquo;{appointment.notes}&rdquo;
            </p>
          )}

          {showLink && (
            <div className="mt-4">
              <SessionLink appointment={appointment} onSave={onLink} />
            </div>
          )}

          {needsWrapUp && (
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="text-gray-500 dark:text-gray-400">This time has passed.</span>
              <button
                onClick={() => onStatus(appointment.id, 'completed')}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3.5 py-1.5 font-medium text-gray-700 transition hover:border-gray-900 hover:text-gray-900 dark:border-white/10 dark:text-gray-300 dark:hover:border-white dark:hover:text-white"
              >
                <Check size={14} /> Mark as completed
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export default function DoctorSchedulePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<Appointment[]>([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/en/login');
      return;
    }
    apiClient
      .get('/doctor/schedule/')
      .then((res) => setSchedule(res.data))
      .catch((err) => console.error('Failed to fetch schedule', err))
      .finally(() => setLoading(false));
  }, [router]);

  const handleStatus = async (id: string, status: string) => {
    try {
      await apiClient.patch(`/doctor/consultation/${id}/update/`, { status });
      setSchedule((s) => s.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleLink = async (id: string, session_link: string) => {
    try {
      await apiClient.patch(`/doctor/consultation/${id}/update/`, { session_link });
      setSchedule((s) => s.map((a) => (a.id === id ? { ...a, session_link } : a)));
    } catch (err) {
      console.error('Failed to update session link', err);
    }
  };

  const now = new Date();
  const withWhen = schedule.map((a) => ({ a, when: whenOf(a) }));
  const isPast = (x: { a: Appointment; when: Date | null }) =>
    toStatus(x.a.status) === 'completed' || toStatus(x.a.status) === 'cancelled' || (x.when ? x.when < now : false);

  const upcoming = withWhen.filter((x) => !isPast(x)).sort((x, y) => (x.when?.getTime() ?? 0) - (y.when?.getTime() ?? 0));
  const past = withWhen.filter(isPast).sort((x, y) => (y.when?.getTime() ?? 0) - (x.when?.getTime() ?? 0));
  const today = withWhen.filter((x) => x.when && sameDay(x.when, now) && toStatus(x.a.status) !== 'cancelled');

  const stats = [
    { label: 'Today', value: today.length },
    { label: 'Upcoming', value: upcoming.length },
    { label: 'Past', value: past.length },
  ];

  const group = (title: string, items: typeof withWhen, isPastGroup: boolean) =>
    items.length > 0 && (
      <section className="mt-8">
        <h2 className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-gray-500">
          {title} <span className="rounded-full bg-gray-200/70 px-2 py-0.5 text-gray-600 dark:bg-white/10 dark:text-gray-300">{items.length}</span>
        </h2>
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-3xl border border-gray-200 bg-white dark:divide-white/5 dark:border-white/10 dark:bg-gray-900">
          {items.map(({ a }) => (
            <AppointmentRow key={a.id} appointment={a} past={isPastGroup} onStatus={handleStatus} onLink={handleLink} />
          ))}
        </ul>
      </section>
    );

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-primary dark:border-white/10" />
      </div>
    );
  }

  return (
    <div className="pb-16">
      <header className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-gray-500">Doctor portal</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl font-extrabold tracking-tightest text-gray-900 dark:text-white">Schedule</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Manage your upcoming appointments and consultations.</p>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-8 grid grid-cols-3 overflow-hidden rounded-3xl bg-ink text-white dark:ring-1 dark:ring-white/10">
          {stats.map((s, i) => (
            <div key={s.label} className={`p-5 sm:p-6 ${i > 0 ? 'border-l border-white/10' : ''}`}>
              <p className="font-display text-4xl sm:text-5xl font-bold tracking-tight tabular">{s.value}</p>
              <p className="mt-1 text-sm text-white/60">{s.label}</p>
            </div>
          ))}
        </div>

        {schedule.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-gray-900">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
              <CalendarIcon size={24} />
            </span>
            <h2 className="mt-5 font-display text-2xl font-bold text-gray-900 dark:text-white">No Appointments Yet</h2>
            <p className="mx-auto mt-2 max-w-md text-gray-500 dark:text-gray-400">
              No appointments scheduled yet. Appointments will appear here once patients book consultations with you.
            </p>
          </div>
        ) : (
          <>
            {group('Upcoming', upcoming, false)}
            {upcoming.length === 0 && (
              <p className="mt-8 rounded-3xl border border-dashed border-gray-300 px-5 py-4 text-gray-500 dark:border-white/10 dark:text-gray-400">
                Nothing booked ahead. New bookings from patients will show up here.
              </p>
            )}
            {group('Past', past, true)}
          </>
        )}
      </div>
    </div>
  );
}
