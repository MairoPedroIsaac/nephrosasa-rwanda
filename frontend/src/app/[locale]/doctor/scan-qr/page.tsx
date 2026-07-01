'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { QrCode, ArrowRight, Info } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import apiClient from '@/lib/api';

export default function DoctorScanQrPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const val = inputVal.trim();
    if (!val) {
      setError('Please enter a valid token or URL.');
      return;
    }

    let token = val;
    if (val.includes('/shared-record/')) {
      const parts = val.split('/shared-record/');
      if (parts.length > 1) {
        token = parts[1].split('/')[0].split('?')[0];
      }
    }

    if (!token || token.length < 5) {
      setError('Invalid token format.');
      return;
    }

    try {
      await apiClient.post('/doctor/add-patient/', { token });
    } catch (err) {
      console.error('Failed to save patient to list:', err);
    }

    router.push(`/${locale}/shared-record/${token}`);
  };

  return (
    <div className="min-h-full pb-12 bg-gray-50 dark:bg-gray-900 transition-colors p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            Scan Patient QR
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Enter a patient's NephroSasa share token or paste their share URL to access their health record.
          </p>
        </div>

        <Card className="shadow-xl shadow-primary/5 p-8 mb-8">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <QrCode size={40} className="text-primary" />
          </div>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-6">
              <label htmlFor="tokenInput" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Patient Share Token or URL
              </label>
              <input
                id="tokenInput"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter token (e.g. abc123...) or paste full share URL"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              />
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>
            
            <Button type="submit" variant="primary" size="lg" className="w-full shadow-md shadow-primary/20 flex justify-center items-center">
              Access Patient Record
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </form>
        </Card>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl shadow-sm dark:bg-blue-900/20 flex items-start gap-4">
          <Info className="text-blue-500 mt-1 flex-shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-blue-800 dark:text-blue-300 text-lg mb-2">How to get a patient's token:</h4>
            <p className="text-blue-700 dark:text-blue-400">
              Ask your patient to go to <span className="font-semibold">Share Record</span> in their NephroSasa portal and share their QR code or copy their share URL. You can then paste it here to instantly access their kidney health history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
