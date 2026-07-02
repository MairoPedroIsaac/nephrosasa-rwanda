'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, Clock, Video, MapPin, User, CheckCircle, AlertCircle, XCircle, Link as LinkIcon } from 'lucide-react';
import { isAuthenticated } from '@/lib/auth';
import apiClient from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const ConsultationCard = ({ appointment, onUpdateStatus, onUpdateSessionLink }: any) => {
  const [sessionLinkInput, setSessionLinkInput] = useState(appointment.session_link || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const isVirtual = (appointment.consultation_type || '').toLowerCase().includes('virtual');
  
  let StatusIcon = AlertCircle;
  let statusClasses = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50";
  
  if (appointment.status === 'Confirmed') {
    StatusIcon = CheckCircle;
    statusClasses = "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50";
  } else if (appointment.status === 'Cancelled') {
    StatusIcon = XCircle;
    statusClasses = "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50";
  }

  const handleSaveLink = async () => {
    setIsSaving(true);
    await onUpdateSessionLink(appointment.id, sessionLinkInput);
    setIsSaving(false);
  };

  return (
    <Card className="shadow-xl shadow-primary/5 p-6 hover:border-primary transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary">
            <User size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
              {appointment.patient_name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {appointment.patient_email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm ${statusClasses}`}>
            <StatusIcon size={14} /> {appointment.status || 'Pending'}
          </span>
          <select 
            value={appointment.status || 'Pending'} 
            onChange={(e) => onUpdateStatus(appointment.id, e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-1.5 outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <CalendarIcon size={18} className="text-primary" />
          <span className="font-medium">{appointment.scheduled_date}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Clock size={18} className="text-accent" />
          <span className="font-medium">{appointment.scheduled_time}</span>
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            {isVirtual ? (
              <>
                <Video size={18} className="text-purple-500" />
                <span className="font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-0.5 rounded text-sm">Virtual Session</span>
              </>
            ) : (
              <>
                <MapPin size={18} className="text-blue-500" />
                <span className="font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded text-sm">In-Person Visit</span>
              </>
            )}
          </div>
          
          {isVirtual && (
            <div className="mt-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <LinkIcon size={16} /> Session Link (Zoom / Google Meet)
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={sessionLinkInput}
                  onChange={(e) => setSessionLinkInput(e.target.value)}
                  placeholder="Paste meeting link here"
                  className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                />
                <Button variant="primary" size="sm" onClick={handleSaveLink} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                {appointment.session_link && (
                  <Button variant="outline" size="sm" onClick={() => window.open(appointment.session_link, '_blank')} className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-900/50 dark:text-blue-400">
                    Join Meeting
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        {appointment.notes && (
          <div className="sm:col-span-2 mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold block mb-1">Notes:</span>
            {appointment.notes}
          </div>
        )}
      </div>
    </Card>
  );
};

export default function DoctorSchedulePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/en/login');
      return;
    }

    const fetchSchedule = async () => {
      try {
        const response = await apiClient.get('/doctor/schedule/');
        setSchedule(response.data);
      } catch (err) {
        console.error('Failed to fetch schedule', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [router]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await apiClient.patch(`/doctor/consultation/${id}/update/`, { status: newStatus });
      setSchedule(schedule.map(app => app.id === id ? { ...app, status: newStatus } : app));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleUpdateSessionLink = async (id: string, sessionLink: string) => {
    try {
      await apiClient.patch(`/doctor/consultation/${id}/update/`, { session_link: sessionLink });
      setSchedule(schedule.map(app => app.id === id ? { ...app, session_link: sessionLink } : app));
    } catch (err) {
      console.error('Failed to update session link', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full pb-12 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-12 bg-gray-50 dark:bg-gray-900 transition-colors p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            Schedule
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Manage your upcoming appointments and consultations.
          </p>
        </div>

        {schedule.length === 0 ? (
          <Card className="shadow-xl shadow-primary/5 p-12 text-center border-t-4 border-primary">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarIcon size={40} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Appointments Yet</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              No appointments scheduled yet. Appointments will appear here once patients book consultations with you.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {schedule.map((appointment) => (
              <ConsultationCard 
                key={appointment.id} 
                appointment={appointment} 
                onUpdateStatus={handleUpdateStatus}
                onUpdateSessionLink={handleUpdateSessionLink}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
