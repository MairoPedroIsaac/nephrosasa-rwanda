'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, Activity, HeartPulse, Droplet, User, MapPin } from 'lucide-react';
import Card from '@/components/ui/Card';

export default function SharedRecordPage({ params }: { params: { token: string } }) {
  const [loading, setLoading] = useState(true);
  const [recordData, setRecordData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchSharedRecord();
  }, [params.token]);

  const fetchSharedRecord = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${baseUrl}/shared-record/${params.token}/`);
      
      if (!response.ok) {
        throw new Error('Record not found');
      }
      
      const data = await response.json();
      setRecordData(data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      </div>
    );
  }

  if (error || !recordData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center shadow-xl shadow-red-500/5">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="text-red-500 w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Record Not Found or Link Expired</h1>
          <p className="text-gray-600 dark:text-gray-400">
            This health record link is no longer active. Ask your patient to generate a new QR code.
          </p>
        </Card>
      </div>
    );
  }

  const {
    patient_name,
    diagnosis_type,
    latest_risk_score,
    recent_vitals,
    total_entries,
    generated_at
  } = recordData;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header Area */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">
              <span className="text-primary">Nephro</span>
              <span className="text-accent">Sasa</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        
        {/* Green Banner */}
        <div className="bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800 rounded-xl p-4 mb-8 flex items-start sm:items-center gap-4">
          <CheckCircle className="text-green-500 shrink-0 w-6 h-6 mt-0.5 sm:mt-0" />
          <div>
            <h3 className="font-bold text-green-800 dark:text-green-400">Verified Patient Health Record - Read Only</h3>
            <p className="text-sm text-green-700 dark:text-green-500">This record was shared by the patient and cannot be modified.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Patient Info Card */}
          <Card className="md:col-span-2 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User size={20} className="text-primary" />
              Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Full Name</p>
                <p className="font-semibold text-gray-900 dark:text-white">{patient_name}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Diagnosis</p>
                <p className="font-semibold text-gray-900 dark:text-white">{diagnosis_type}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg col-span-2 sm:col-span-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Vitals Logged</p>
                <p className="font-semibold text-gray-900 dark:text-white">{total_entries} entries</p>
              </div>
            </div>
          </Card>

          {/* Risk Score Card */}
          <Card className="shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-center items-center text-center">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Latest Risk Score</h3>
            
            {latest_risk_score ? (
              <>
                <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center mb-4 ${latest_risk_score.risk_level === 'HIGH' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600' : latest_risk_score.risk_level === 'LOW' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-600' : 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-600'}`}>
                  <span className="text-xl font-bold">{latest_risk_score.risk_level}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium text-lg">
                  {latest_risk_score.confidence}% Confidence
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  As of {new Date(latest_risk_score.scored_at).toLocaleDateString()}
                </p>
              </>
            ) : (
              <p className="text-gray-500">No risk score available</p>
            )}
          </Card>
        </div>

        {/* Recent Vitals */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity size={24} className="text-primary" />
          Recent Vital Logs
        </h3>
        
        {recent_vitals && recent_vitals.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Date & Time</th>
                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Blood Pressure</th>
                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Blood Sugar</th>
                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recent_vitals.map((vital: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {new Date(vital.recorded_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(vital.recorded_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <HeartPulse size={16} className={vital.systolic_bp > 140 ? 'text-red-500' : 'text-primary'} />
                          <span className={`font-semibold ${vital.systolic_bp > 140 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                            {vital.systolic_bp}/{vital.diastolic_bp}
                          </span>
                          <span className="text-xs text-gray-500">mmHg</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Droplet size={16} className={vital.blood_sugar > 140 ? 'text-amber-500' : 'text-accent'} />
                          <span className={`font-semibold ${vital.blood_sugar > 140 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-white'}`}>
                            {vital.blood_sugar}
                          </span>
                          <span className="text-xs text-gray-500">mg/dL</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          vital.source === 'Clinic' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}>
                          {vital.source || 'Home'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500">No vitals logged yet.</p>
          </div>
        )}
      </div>

      {/* Mini Footer */}
      <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-6 text-center px-4">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Powered by NephroSasa Rwanda - Monitor Your Kidneys. Before It's Too Late.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          This is an AI-generated risk assessment and does not constitute a clinical diagnosis. Always consult a qualified healthcare provider for medical advice.
        </p>
      </footer>
    </div>
  );
}
