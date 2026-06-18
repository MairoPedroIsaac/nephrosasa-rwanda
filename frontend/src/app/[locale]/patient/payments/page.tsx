'use client';

import React from 'react';
import { CreditCard, QrCode, Smartphone, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function PaymentsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <CreditCard className="text-primary" size={32} />
          Mobile Payments & Billing
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your consultation fees and billing through seamless mobile money integration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* MTN MoMo */}
        <Card className="shadow-xl shadow-primary/5 p-8 border-t-4 border-[#ffcc00]">
          <div className="flex justify-between items-start mb-6">
            <div className="w-16 h-16 bg-[#ffcc00]/10 rounded-2xl flex items-center justify-center">
              <Smartphone size={32} className="text-[#e6b800]" />
            </div>
            <span className="bg-[#ffcc00] text-black font-bold px-3 py-1 rounded text-sm">MTN MoMo</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Pay via MTN Mobile Money</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Instant, secure payments directly from your MTN number. 
          </p>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <QrCode size={24} className="text-gray-500" />
              <span className="font-mono text-lg font-bold tracking-wider text-gray-900 dark:text-white">*182*8*1*123456#</span>
            </div>
          </div>
          <Button variant="outline" fullWidth size="lg" className="border-gray-200 dark:border-gray-700">
            Generate Payment QR
          </Button>
        </Card>

        {/* Airtel Money */}
        <Card className="shadow-xl shadow-primary/5 p-8 border-t-4 border-[#ff0000]">
          <div className="flex justify-between items-start mb-6">
            <div className="w-16 h-16 bg-[#ff0000]/10 rounded-2xl flex items-center justify-center">
              <Smartphone size={32} className="text-[#ff0000]" />
            </div>
            <span className="bg-[#ff0000] text-white font-bold px-3 py-1 rounded text-sm">Airtel Money</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Pay via Airtel Money</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Quickly settle your consultation bills using Airtel Money.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <QrCode size={24} className="text-gray-500" />
              <span className="font-mono text-lg font-bold tracking-wider text-gray-900 dark:text-white">*500*4*123456#</span>
            </div>
          </div>
          <Button variant="outline" fullWidth size="lg" className="border-gray-200 dark:border-gray-700">
            Generate Payment QR
          </Button>
        </Card>
      </div>

      {/* Billing History Placeholder */}
      <Card className="mt-8 shadow-xl shadow-primary/5 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
          <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
            Download Invoice
          </Button>
        </div>
        <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No recent transactions found.</p>
        </div>
      </Card>
    </div>
  );
}
