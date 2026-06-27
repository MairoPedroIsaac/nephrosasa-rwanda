'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HeartPulse, Droplet, CheckCircle, Home, Hospital } from 'lucide-react';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import apiClient from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function LogVitalsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [mode, setMode] = useState<'home' | 'clinic'>('home');

  const [vitalsForm, setVitalsForm] = useState({
    systolicBP: '',
    diastolicBP: '',
    bloodSugar: '',
    hba1c: '',
    creatinine: '',
    bun: '',
    gfr: '',
    sodium: '',
    potassium: '',
    hemoglobin: ''
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
    
    const saved = localStorage.getItem('nephrosasa_vitals_form');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.vitalsForm) setVitalsForm(parsed.vitalsForm);
        if (parsed.mode) setMode(parsed.mode);
      } catch (e) {
        console.error('Failed to parse saved vitals form', e);
      }
    }
    
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (loading || success) return;
    localStorage.setItem('nephrosasa_vitals_form', JSON.stringify({ vitalsForm, mode }));
  }, [vitalsForm, mode, loading, success]);

  const handleVitalsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const payload: any = {
        systolic_bp: vitalsForm.systolicBP,
        diastolic_bp: vitalsForm.diastolicBP,
        blood_sugar: vitalsForm.bloodSugar
      };
      
      if (mode === 'clinic') {
        if (vitalsForm.hba1c) payload.hba1c = vitalsForm.hba1c;
        if (vitalsForm.creatinine) payload.creatinine = vitalsForm.creatinine;
        if (vitalsForm.bun) payload.bun = vitalsForm.bun;
        if (vitalsForm.gfr) payload.gfr = vitalsForm.gfr;
        if (vitalsForm.sodium) payload.sodium = vitalsForm.sodium;
        if (vitalsForm.potassium) payload.potassium = vitalsForm.potassium;
        if (vitalsForm.hemoglobin) payload.hemoglobin = vitalsForm.hemoglobin;
      }

      await apiClient.post('/vitals/log/', payload);
      setSuccess(true);
      localStorage.removeItem('nephrosasa_vitals_form');
      setVitalsForm({ 
        systolicBP: '', diastolicBP: '', bloodSugar: '', 
        hba1c: '', creatinine: '', bun: '', gfr: '', 
        sodium: '', potassium: '', hemoglobin: '' 
      });
      setTimeout(() => {
        router.push('/en/patient/dashboard');
      }, 2000);
    } catch (err: any) {
      console.error('Error logging vitals', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.detail || 'Failed to log vitals. Please try again.';
      setError(errorMsg);
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

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 shadow-inner">
              <button
                type="button"
                onClick={() => setMode('home')}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                  mode === 'home' 
                    ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <Home size={18} />
                Home Monitoring
              </button>
              <button
                type="button"
                onClick={() => setMode('clinic')}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                  mode === 'clinic' 
                    ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <Hospital size={18} />
                Clinic Visit
              </button>
            </div>
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

            {mode === 'clinic' && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Clinic Lab Results (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="hba1c" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                      HbA1c (%)
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Get this value from your clinic lab results</p>
                    <input
                      id="hba1c"
                      type="number"
                      step="0.1"
                      value={vitalsForm.hba1c}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, hba1c: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 placeholder:text-gray-400 text-lg"
                      placeholder="e.g. 5.5"
                    />
                  </div>
                  <div>
                    <label htmlFor="creatinine" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Serum Creatinine (mg/dL)
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Get this value from your clinic lab results</p>
                    <input
                      id="creatinine"
                      type="number"
                      step="0.01"
                      value={vitalsForm.creatinine}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, creatinine: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 placeholder:text-gray-400 text-lg"
                      placeholder="e.g. 1.0"
                    />
                  </div>
                  <div>
                    <label htmlFor="bun" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                      BUN (mg/dL)
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Get this value from your clinic lab results</p>
                    <input
                      id="bun"
                      type="number"
                      step="0.1"
                      value={vitalsForm.bun}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, bun: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 placeholder:text-gray-400 text-lg"
                      placeholder="e.g. 15.0"
                    />
                  </div>
                  <div>
                    <label htmlFor="gfr" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                      eGFR (mL/min)
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Get this value from your clinic lab results</p>
                    <input
                      id="gfr"
                      type="number"
                      step="0.1"
                      value={vitalsForm.gfr}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, gfr: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 placeholder:text-gray-400 text-lg"
                      placeholder="e.g. 90.0"
                    />
                  </div>
                  <div>
                    <label htmlFor="sodium" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Serum Sodium (mEq/L)
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Get this value from your clinic lab results</p>
                    <input
                      id="sodium"
                      type="number"
                      step="0.1"
                      value={vitalsForm.sodium}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, sodium: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 placeholder:text-gray-400 text-lg"
                      placeholder="e.g. 140.0"
                    />
                  </div>
                  <div>
                    <label htmlFor="potassium" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Serum Potassium (mEq/L)
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Get this value from your clinic lab results</p>
                    <input
                      id="potassium"
                      type="number"
                      step="0.1"
                      value={vitalsForm.potassium}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, potassium: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 placeholder:text-gray-400 text-lg"
                      placeholder="e.g. 4.0"
                    />
                  </div>
                  <div>
                    <label htmlFor="hemoglobin" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Hemoglobin (g/dL)
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Get this value from your clinic lab results</p>
                    <input
                      id="hemoglobin"
                      type="number"
                      step="0.1"
                      value={vitalsForm.hemoglobin}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, hemoglobin: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 placeholder:text-gray-400 text-lg"
                      placeholder="e.g. 13.5"
                    />
                  </div>
                </div>
              </div>
            )}

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
