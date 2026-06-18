'use client';

import React from 'react';
import { QrCode, Share2, Download, ShieldCheck } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getCurrentUser } from '@/lib/auth';

export default function QRCodePage() {
  const user = getCurrentUser();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <QrCode className="text-primary" size={32} />
          Share Health Record
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Securely share your vitals history and AI risk score with authorized healthcare providers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-xl shadow-primary/5 p-8 flex flex-col items-center text-center border-t-4 border-primary">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your Secure Medical QR Code</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Doctors can scan this code to temporarily access your NephroSasa records.
          </p>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8">
            {/* Simulated QR Code using a generic placeholder or CSS blocks */}
            <div className="w-48 h-48 bg-gray-100 border border-gray-200 flex flex-col items-center justify-center p-4">
               <QrCode size={120} className="text-gray-800" />
               <p className="text-xs font-mono mt-2 tracking-widest text-gray-400">NSR-{user?.id || '28471'}</p>
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <Button variant="outline" fullWidth className="border-gray-200 dark:border-gray-700">
              <Download size={18} className="mr-2" />
              Save
            </Button>
            <Button variant="primary" fullWidth>
              <Share2 size={18} className="mr-2" />
              Share Link
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-lg shadow-primary/5 p-6 bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/50">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-2 mb-3">
              <ShieldCheck size={20} className="text-blue-600 dark:text-blue-400" />
              How it works
            </h3>
            <ul className="space-y-3 text-sm text-blue-800 dark:text-blue-200/80">
              <li className="flex gap-2">
                <span className="font-bold">1.</span>
                Show this QR code to your doctor or nurse during a visit.
              </li>
              <li className="flex gap-2">
                <span className="font-bold">2.</span>
                They scan it using their NephroSasa provider app.
              </li>
              <li className="flex gap-2">
                <span className="font-bold">3.</span>
                They gain temporary, read-only access to your vitals history and AI score.
              </li>
            </ul>
          </Card>

          <Card className="shadow-lg shadow-primary/5 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Active Access Approvals</h3>
            <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No active provider accesses at the moment.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
