'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Video, MapPin, User, Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { isAuthenticated } from '@/lib/auth';
import apiClient from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function ConsultPage() {
  const router = useRouter();
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingConsultations, setLoadingConsultations] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    consultation_type: 'virtual',
    doctor_id: '',
    scheduled_date: '',
    scheduled_time: '',
    notes: ''
  });

  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', 
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

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
        setFormData(prev => ({ ...prev, doctor_id: response.data[0].id }));
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

    try {
      await apiClient.post('/consultations/book/', formData);
      setSuccessMsg(`Consultation request sent! Your doctor will confirm your appointment.`);
      setFormData({
        consultation_type: 'virtual',
        doctor_id: doctors.length > 0 ? doctors[0].id : '',
        scheduled_date: '',
        scheduled_time: '',
        notes: ''
      });
      fetchConsultations(); // Refresh list
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to book consultation. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-full pb-12 bg-gray-50 dark:bg-gray-900 transition-colors p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            Consultations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Book and manage your appointments with verified nephrologists.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section 1: Book a Consultation */}
          <Card className="shadow-xl shadow-primary/5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Calendar className="text-primary" />
              Book a Consultation
            </h2>

            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start gap-3">
                <CheckCircle className="shrink-0 mt-0.5" />
                <p>{successMsg}</p>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
                <AlertCircle className="shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Consultation Type Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Consultation Type
                </label>
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, consultation_type: 'virtual' })}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      formData.consultation_type === 'virtual'
                        ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    <Video size={18} />
                    Virtual Session
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, consultation_type: 'in_person' })}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      formData.consultation_type === 'in_person'
                        ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    <MapPin size={18} />
                    In-Person Visit
                  </button>
                </div>
              </div>

              {/* Select Doctor */}
              <div>
                <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Nephrologist *
                </label>
                {loadingDoctors ? (
                  <div className="animate-pulse h-12 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                ) : doctors.length === 0 ? (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-xl border border-amber-200 dark:border-amber-800/50">
                    No verified nephrologists available yet. Check back soon.
                  </div>
                ) : (
                  <select
                    id="doctor"
                    value={formData.doctor_id}
                    onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary dark:focus:border-primary transition-all duration-200"
                    required
                  >
                    {doctors.map((doctor: any) => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.full_name} - {doctor.rmdc_number}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    min={today}
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary dark:focus:border-primary transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Time *
                  </label>
                  <select
                    id="time"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary dark:focus:border-primary transition-all duration-200"
                    required
                  >
                    <option value="" disabled>Select a time</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Describe your symptoms or reason for consultation..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary dark:focus:border-primary transition-all duration-200"
                ></textarea>
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                fullWidth 
                disabled={submitLoading || doctors.length === 0}
              >
                {submitLoading ? 'Booking...' : 'Book Consultation'}
              </Button>
            </form>
          </Card>

          {/* Section 2: My Consultations */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="text-primary" />
              My Consultations
            </h2>
            
            {loadingConsultations ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 h-32 rounded-xl"></div>
                ))}
              </div>
            ) : consultations.length === 0 ? (
              <Card className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No consultations booked yet.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {consultations.map((consultation: any) => {
                  const status = consultation.status || 'Pending';
                  const isConfirmed = status.toLowerCase() === 'confirmed';
                  const isCancelled = status.toLowerCase() === 'cancelled';
                  
                  return (
                  <Card key={consultation.id} className="p-5 shadow-md border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                          <User size={18} className="text-primary" />
                          Dr. {consultation.doctor_name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                          {consultation.consultation_type === 'Virtual' || consultation.consultation_type === 'virtual' ? <Video size={14} /> : <MapPin size={14} />}
                          {consultation.consultation_type === 'Virtual' || consultation.consultation_type === 'virtual' ? 'Virtual Session' : 'In-Person Visit'}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        isConfirmed ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                        isCancelled ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' :
                        'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                      }`}>
                        {status}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg flex flex-col gap-3 mb-3">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <Calendar size={16} className="text-gray-400" />
                          {new Date(consultation.scheduled_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <Clock size={16} className="text-gray-400" />
                          {consultation.scheduled_time}
                        </div>
                      </div>

                      {isConfirmed && consultation.session_link && (
                        <div className="pt-2 mt-1 border-t border-gray-200 dark:border-gray-700">
                          <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={() => window.open(consultation.session_link, '_blank')}
                          >
                            <Video size={14} className="mr-2" />
                            Join Meeting
                          </Button>
                        </div>
                      )}
                    </div>

                    {consultation.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                        "{consultation.notes}"
                      </p>
                    )}
                  </Card>
                )})}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
