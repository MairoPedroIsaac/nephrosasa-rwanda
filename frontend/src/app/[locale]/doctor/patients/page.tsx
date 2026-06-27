'use client';

import React from 'react';
import Link from 'next/link';
import { Users, QrCode } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function DoctorPatientsPage() {
  return (
    <div className="min-h-full pb-12 bg-gray-50 dark:bg-gray-900 transition-colors p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            My Patients
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Patients who have shared their health records with you.
          </p>
        </div>

        <Card className="shadow-xl shadow-primary/5 text-center py-20 px-4">
          <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users size={48} className="text-primary" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No patients yet.
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
            When a patient shares their QR code with you and you scan it, their record will appear here.
          </p>

          <Link href="/en/doctor/scan-qr">
            <Button variant="primary" size="lg" className="shadow-md shadow-primary/20">
              <QrCode size={20} className="mr-2" />
              Scan Patient QR Code
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
