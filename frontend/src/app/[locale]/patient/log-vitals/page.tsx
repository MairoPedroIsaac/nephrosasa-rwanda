'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HeartPulse, Droplet, CheckCircle } from 'lucide-react';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import apiClient from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function LogVitalsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [vitalsForm, setVitalsForm] = useState({
    systolicBP: '',
    diastolicBP: '',
    bloodSugar: '',
  });

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
    setLoading(false);
  }, [router]);

  const handleVitalsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/vitals/log/', {
        systolic_bp: vitalsForm.systolicBP,
        diastolic_bp: vitalsForm.diastolicBP,
        blood_sugar: vitalsForm.bloodSugar
      });
      setSuccess(true);
      setVitalsForm({ systolicBP: '', diastolicBP: '', bloodSugar: '' });
      setTimeout(() => {
        router.push('/en/patient/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error logging vitals', error);
      alert('Failed to log vitals. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {success ? (
        <Card className="shadow-2xl shadow-primary/10 text-center py-16">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Readings Saved!</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Your AI Kidney Risk Score has been updated. Redirecting you to your dashboard...
          </p>
        </Card>
      ) : (
        <Card className="shadow-2xl shadow-primary/10 p-8 sm:p-12">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <HeartPulse className="text-primary" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Log Your Daily Vitals
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Enter your readings to update your predictive health model.
            </p>
          </div>

          <form onSubmit={handleVitalsSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="systolicBP" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Systolic BP (mmHg)
                </label>
                <input
                  id="systolicBP"
                  type="number"
                  value={vitalsForm.systolicBP}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, systolicBP: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 placeholder:text-gray-400 text-lg"
                  placeholder="e.g. 120"
                  required
                />
              </div>
              <div>
                <label htmlFor="diastolicBP" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Diastolic BP (mmHg)
                </label>
                <input
                  id="diastolicBP"
                  type="number"
                  value={vitalsForm.diastolicBP}
                  onChange={(e) => setVitalsForm({ ...vitalsForm, diastolicBP: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 placeholder:text-gray-400 text-lg"
                  placeholder="e.g. 80"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="bloodSugar" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Droplet size={20} className="text-red-500" />
                Fasting Blood Sugar (mmol/L)
              </label>
              <input
                id="bloodSugar"
                type="number"
                step="0.1"
                value={vitalsForm.bloodSugar}
                onChange={(e) => setVitalsForm({ ...vitalsForm, bloodSugar: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 placeholder:text-gray-400 text-lg"
                placeholder="e.g. 5.5"
                required
              />
            </div>

            <div className="pt-4">
              <Button type="submit" variant="primary" fullWidth size="lg" className="text-xl py-5 rounded-xl" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Readings'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
