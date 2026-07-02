'use client';

import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Filter, Download, CheckCircle } from 'lucide-react';
import apiClient from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface VitalsRecord {
  id: number;
  recorded_at: string;
  systolic_bp: number;
  diastolic_bp: number;
  blood_sugar: number;
  ai_risk_score: string;
  confidence_percentage: number;
  hba1c?: number | null;
  creatinine?: number | null;
  bun?: number | null;
  gfr?: number | null;
  sodium?: number | null;
  potassium?: number | null;
  hemoglobin?: number | null;
}

export default function HealthHistoryPage() {
  const [records, setRecords] = useState<VitalsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await apiClient.get('/vitals/history/');
        setRecords(response.data);
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getRiskColor = (score: string) => {
    if (score === 'HIGH') return 'text-red-600 bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400';
    if (score === 'MEDIUM') return 'text-amber-600 bg-amber-100 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400';
    return 'text-teal-600 bg-teal-100 border-teal-200 dark:bg-teal-900/30 dark:border-teal-800 dark:text-teal-400';
  };

  const filteredRecords = records.filter(record => {
    if (riskFilter !== 'ALL' && record.ai_risk_score !== riskFilter) return false;
    return true;
  });

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) return;
    
    setIsExporting(true);
    setExportSuccess(false);
    
    setTimeout(() => {
      const headers = ['Date', 'Systolic BP (mmHg)', 'Diastolic BP (mmHg)', 'Blood Sugar (mmol/L)', 'AI Risk Score', 'Confidence %', 'Mode', 'HbA1c (%)', 'Creatinine (mg/dL)', 'BUN (mg/dL)', 'eGFR (mL/min)', 'Sodium (mEq/L)', 'Potassium (mEq/L)', 'Hemoglobin (g/dL)'];
      const csvRows = [headers.join(',')];
      
      filteredRecords.forEach(record => {
        const date = new Date(record.recorded_at).toLocaleDateString('en-RW', {
          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }).replace(/,/g, '');
        
        const isClinic = record.hba1c != null || record.creatinine != null || record.bun != null || record.gfr != null || record.sodium != null || record.potassium != null || record.hemoglobin != null;
        const mode = isClinic ? 'Clinic' : 'Home';
        const hba1c = isClinic && record.hba1c != null ? record.hba1c : '';
        const creatinine = isClinic && record.creatinine != null ? record.creatinine : '';
        const bun = isClinic && record.bun != null ? record.bun : '';
        const gfr = isClinic && record.gfr != null ? record.gfr : '';
        const sodium = isClinic && record.sodium != null ? record.sodium : '';
        const potassium = isClinic && record.potassium != null ? record.potassium : '';
        const hemoglobin = isClinic && record.hemoglobin != null ? record.hemoglobin : '';

        csvRows.push(`${date},${record.systolic_bp},${record.diastolic_bp},${record.blood_sugar},${record.ai_risk_score},${record.confidence_percentage},${mode},${hba1c},${creatinine},${bun},${gfr},${sodium},${potassium},${hemoglobin}`);
      });
      
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'NephroSasa_Vitals_History.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Clock className="text-primary" size={32} />
            Health History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and download your complete vitals log and AI risk trends.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
          >
            <option value="ALL">All Risks</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
          </select>
          <Button variant="primary" onClick={handleExportCSV} disabled={isExporting}>
            {isExporting ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Exporting...
              </span>
            ) : exportSuccess ? (
              <span className="flex items-center gap-2">
                <CheckCircle size={18} className="text-white" />
                Downloaded!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Download size={18} />
                Export CSV
              </span>
            )}
          </Button>
        </div>
      </div>

      {records.length === 0 ? (
        <Card className="text-center py-16 shadow-lg shadow-primary/5">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No history available</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            You haven't logged any vitals yet. Start logging your daily readings to build your health history.
          </p>
        </Card>
      ) : (
        <Card className="shadow-xl shadow-primary/5 overflow-hidden p-0">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Blood Pressure</th>
                  <th className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Blood Sugar</th>
                  <th className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Mode</th>
                  <th className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">AI Risk Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredRecords.map((record) => {
                  const isClinic = record.hba1c != null || record.creatinine != null || record.bun != null || record.gfr != null || record.sodium != null || record.potassium != null || record.hemoglobin != null;
                  return (
                    <React.Fragment key={record.id}>
                      <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                        <td className="py-4 px-6 text-gray-900 dark:text-gray-100">
                          {new Date(record.recorded_at).toLocaleDateString('en-RW', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-medium text-gray-900 dark:text-gray-100">{record.systolic_bp}</span>
                          <span className="text-gray-500 dark:text-gray-400 mx-1">/</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{record.diastolic_bp}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">mmHg</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-medium text-gray-900 dark:text-gray-100">{record.blood_sugar}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">mmol/L</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isClinic
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                            {isClinic ? 'Clinic' : 'Home'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(record.ai_risk_score)}`}>
                            {record.ai_risk_score} RISK
                          </span>
                        </td>
                      </tr>
                      {isClinic && (
                        <tr className="bg-gray-50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-700">
                          <td colSpan={5} className="px-6 py-3">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-500 dark:text-gray-400">
                              {record.hba1c != null && <span><strong>HbA1c:</strong> {record.hba1c}%</span>}
                              {record.creatinine != null && <span><strong>Creatinine:</strong> {record.creatinine} mg/dL</span>}
                              {record.bun != null && <span><strong>BUN:</strong> {record.bun} mg/dL</span>}
                              {record.gfr != null && <span><strong>GFR:</strong> {record.gfr} mL/min</span>}
                              {record.sodium != null && <span><strong>Sodium:</strong> {record.sodium} mEq/L</span>}
                              {record.potassium != null && <span><strong>Potassium:</strong> {record.potassium} mEq/L</span>}
                              {record.hemoglobin != null && <span><strong>Hemoglobin:</strong> {record.hemoglobin} g/dL</span>}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
            {filteredRecords.map((record) => {
              const isClinic = record.hba1c != null || record.creatinine != null || record.bun != null || record.gfr != null || record.sodium != null || record.potassium != null || record.hemoglobin != null;
              return (
              <div key={record.id} className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(record.recorded_at).toLocaleDateString('en-RW', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="flex gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isClinic ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                      {isClinic ? 'Clinic' : 'Home'}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${getRiskColor(record.ai_risk_score)}`}>
                      {record.ai_risk_score}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/30 p-3 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Blood Pressure</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {record.systolic_bp}/{record.diastolic_bp} <span className="text-xs font-normal text-gray-500">mmHg</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Blood Sugar</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {record.blood_sugar} <span className="text-xs font-normal text-gray-500">mmol/L</span>
                    </p>
                  </div>
                </div>

                {isClinic && (
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-3 rounded-lg mt-2 border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Clinic Labs</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                        {record.hba1c != null && <span><strong>HbA1c:</strong> {record.hba1c}%</span>}
                        {record.creatinine != null && <span><strong>Creatinine:</strong> {record.creatinine} mg/dL</span>}
                        {record.bun != null && <span><strong>BUN:</strong> {record.bun} mg/dL</span>}
                        {record.gfr != null && <span><strong>GFR:</strong> {record.gfr} mL/min</span>}
                        {record.sodium != null && <span><strong>Sodium:</strong> {record.sodium} mEq/L</span>}
                        {record.potassium != null && <span><strong>Potassium:</strong> {record.potassium} mEq/L</span>}
                        {record.hemoglobin != null && <span><strong>Hemoglobin:</strong> {record.hemoglobin} g/dL</span>}
                    </div>
                  </div>
                )}
              </div>
            )})}
          </div>
        </Card>
      )}
    </div>
  );
}
