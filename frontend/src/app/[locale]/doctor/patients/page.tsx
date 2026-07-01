'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, QrCode, ArrowRight, Activity, Calendar } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import apiClient from '@/lib/api';

interface Patient {
  patient_name: string;
  email: string;
  risk_level: string | null;
  added_at: string;
  share_token: string;
}

export default function DoctorPatientsPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await apiClient.get('/doctor/my-patients/');
      setPatients(response.data);
    } catch (err) {
      console.error('Failed to fetch patients', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string | null) => {
    if (!risk) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    if (risk === 'HIGH') return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
    if (risk === 'MEDIUM') return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    if (risk === 'LOW') return 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
  };

  return (
    <div className="min-h-full pb-12 bg-gray-50 dark:bg-gray-900 transition-colors p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              My Patients
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Patients who have shared their health records with you.
            </p>
          </div>
          {patients.length > 0 && (
            <Link href={`/${locale}/doctor/scan-qr`}>
              <Button variant="primary" className="shadow-sm">
                <QrCode size={18} className="mr-2" />
                Scan Patient
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <Card className="shadow-xl text-center py-20 px-4">
            <p className="text-red-500 mb-4">Failed to load patients. Please try again.</p>
            <Button variant="outline" onClick={fetchPatients}>Retry</Button>
          </Card>
        ) : patients.length === 0 ? (
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

            <Link href={`/${locale}/doctor/scan-qr`}>
              <Button variant="primary" size="lg" className="shadow-md shadow-primary/20">
                <QrCode size={20} className="mr-2" />
                Scan Patient QR Code
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient, idx) => (
              <Card key={idx} className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1" title={patient.patient_name}>
                      {patient.patient_name}
                    </h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getRiskColor(patient.risk_level)}`}>
                      {patient.risk_level || 'NO DATA'}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Activity size={16} className="mr-2 text-gray-400" />
                      <span>Risk Level: <span className="font-semibold text-gray-900 dark:text-gray-200">{patient.risk_level || 'Unknown'}</span></span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar size={16} className="mr-2 text-gray-400" />
                      <span>Added: {new Date(patient.added_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                  <Link href={`/${locale}/shared-record/${patient.share_token}`} className="block">
                    <Button variant="outline" className="w-full flex justify-center items-center group">
                      View Record
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
