'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { QrCode, ArrowRight, Info, Camera, X } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Collapsible from '@/components/ui/Collapsible';
import apiClient from '@/lib/api';
import { Html5Qrcode } from 'html5-qrcode';

export default function DoctorScanQrPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState('');

  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = React.useRef<Html5Qrcode | null>(null);

  React.useEffect(() => {
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isScanning]);

  const processToken = async (val: string) => {
    setError('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    processToken(inputVal.trim());
  };

  const startScanner = async () => {
    setIsScanning(true);
    setError('');
    setTimeout(async () => {
      try {
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;
        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            // On successful scan
            html5QrCode.stop().then(() => {
              setIsScanning(false);
              setInputVal(decodedText);
              processToken(decodedText);
            }).catch(console.error);
          },
          (errorMessage) => {
            // Parse errors are normal when no QR code is in view
          }
        );
      } catch (err) {
        console.error("Camera error:", err);
        setError("Failed to access camera. Please check permissions or use manual entry.");
        setIsScanning(false);
      }
    }, 100);
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (e) {
        console.error(e);
      }
    }
    setIsScanning(false);
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

          <div className="max-w-md mx-auto mb-6">
            {!isScanning ? (
              <Button variant="outline" type="button" onClick={startScanner} className="w-full border-primary text-primary hover:bg-primary/5 dark:hover:bg-primary/20">
                <Camera size={20} className="mr-2" />
                Scan with Camera
              </Button>
            ) : (
              <div className="relative">
                <div id="reader" className="w-full rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-black"></div>
                <Button variant="outline" type="button" onClick={stopScanner} className="mt-4 w-full text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <X size={20} className="mr-2" />
                  Cancel Scanning
                </Button>
              </div>
            )}
          </div>
          
          <div className="relative flex py-5 items-center max-w-md mx-auto">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
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

        <Collapsible 
          title={<span className="font-bold text-blue-800 dark:text-blue-300 text-lg flex items-center gap-2"><Info className="text-blue-500" size={24} /> How to get a patient's token</span>}
          className="border border-blue-100 dark:border-blue-900/50"
          headerClassName="bg-blue-50 dark:bg-blue-900/20 px-6 py-4"
        >
          <div className="bg-blue-50 dark:bg-blue-900/20 px-6 pb-6 rounded-b-lg">
            <p className="text-blue-700 dark:text-blue-400">
              Ask your patient to go to <span className="font-semibold">Share Record</span> in their NephroSasa portal and share their QR code or copy their share URL. You can then paste it here or scan the QR code to instantly access their kidney health history.
            </p>
          </div>
        </Collapsible>
      </div>
    </div>
  );
}
