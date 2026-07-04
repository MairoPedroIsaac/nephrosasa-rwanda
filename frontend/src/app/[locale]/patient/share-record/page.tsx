'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { QrCode, Copy, RefreshCw, CheckCircle, Info, ShieldAlert } from 'lucide-react';
import { isAuthenticated } from '@/lib/auth';
import apiClient from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Collapsible from '@/components/ui/Collapsible';

export default function ShareRecordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [shareData, setShareData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/en/login');
      return;
    }
    fetchShareToken();
  }, [router]);

  const fetchShareToken = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/patient/share-token/');
      setShareData(response.data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch share token');
    } finally {
      setLoading(false);
    }
  };

  const generateToken = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/patient/generate-share-token/', {});
      setShareData(response.data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate share token');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shareData) {
      const fullUrl = `${window.location.origin}/en${shareData.share_url}`;
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading && !shareData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      </div>
    );
  }

  const fullUrl = shareData ? `${window.location.origin}/en${shareData.share_url}` : '';
  const qrCodeUrl = shareData ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullUrl)}` : '';

  return (
    <div className="min-h-full pb-12 bg-gray-50 dark:bg-gray-900 transition-colors p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            Share Your Health Record
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Generate a QR code that gives doctors read-only access to your kidney health history.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left section: QR Code display */}
          <Card className="shadow-xl shadow-primary/5 flex flex-col items-center justify-center p-8 text-center border-t-4 border-primary">
            {shareData ? (
              <>
                <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold px-3 py-1 rounded-full border border-green-200 dark:border-green-800 uppercase tracking-wider flex items-center gap-1 mb-8">
                  <CheckCircle size={16} /> QR Code Active
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-6">
                  <img src={qrCodeUrl} alt="Health Record QR Code" width={200} height={200} className="mx-auto" />
                </div>

                <div className="w-full max-w-md mb-6">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 text-left mb-2">Share URL:</p>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={fullUrl}
                      className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl text-sm"
                    />
                    <Button variant="outline" onClick={copyToClipboard} className="px-4 py-3 bg-white dark:bg-gray-800">
                      {copied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                  Generated on: {new Date(shareData.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>

                <Button variant="outline" size="lg" onClick={generateToken} disabled={loading} className="w-full sm:w-auto">
                  <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Regenerate QR Code
                </Button>
              </>
            ) : (
              <>
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <QrCode size={48} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active QR Code</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">
                  Generate a code to securely share your health records with your healthcare provider.
                </p>
                <Button variant="primary" size="lg" onClick={generateToken} disabled={loading} className="w-full sm:w-auto">
                  <QrCode size={18} className="mr-2" />
                  Generate QR Code
                </Button>
              </>
            )}
          </Card>

          {/* Right section: Instructions */}
          <div className="flex flex-col gap-6">
            <Card className="shadow-xl shadow-primary/5 bg-white dark:bg-gray-800 p-0 overflow-hidden">
              <Collapsible 
                title={
                  <span className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Info className="text-primary" size={24} />
                    How it works
                  </span>
                }
                className="border-none rounded-none"
                headerClassName="p-6 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750"
              >
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-700 before:to-transparent px-6 pb-6">
                  
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-gray-800 bg-primary/10 text-primary font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      1
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                      <p className="text-gray-700 dark:text-gray-300 font-medium">Generate your unique QR code</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-gray-800 bg-primary/10 text-primary font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      2
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                      <p className="text-gray-700 dark:text-gray-300 font-medium">Show it to your nephrologist at your appointment</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-gray-800 bg-primary/10 text-primary font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      3
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                      <p className="text-gray-700 dark:text-gray-300 font-medium">They scan it to instantly access your full kidney health history, including risk scores and vital trends</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-gray-800 bg-primary/10 text-primary font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      4
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                      <p className="text-gray-700 dark:text-gray-300 font-medium">Regenerate anytime to revoke previous access</p>
                    </div>
                  </div>

                </div>
              </Collapsible>
            </Card>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm">
              <div className="flex items-start">
                <ShieldAlert className="h-6 w-6 text-amber-500 mr-3 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-amber-800">Privacy Notice</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Your QR code gives read-only access only. No doctor can edit or delete your records.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
