'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function DoctorPrescriptionsPage() {
  return (
    <div className="min-h-full pb-12 bg-gray-50 dark:bg-gray-900 transition-colors p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              Prescriptions
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Manage and issue prescriptions for your patients.
            </p>
          </div>
          <Link href="#">
            <Button variant="outline" className="bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700">
              <Plus size={18} className="mr-2" />
              Write New Prescription
            </Button>
          </Link>
        </div>

        <Card className="shadow-xl shadow-primary/5 text-center py-20 px-4">
          <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText size={48} className="text-primary" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No prescriptions issued yet.
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
            You can write prescriptions for patients once they appear in your My Patients list.
          </p>

          <Link href="#">
            <Button variant="primary" size="lg" className="shadow-md shadow-primary/20">
              <FileText size={20} className="mr-2" />
              Write New Prescription
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
