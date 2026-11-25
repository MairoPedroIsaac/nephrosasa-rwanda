'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { QrCode, ArrowRight, Info, Camera, X } from 'lucide-react';
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
        // Ignored. The scanner might not have been fully started or already stopped.
      }
    }
    setIsScanning(false);
  };

  return (
    <div className="pb-16">
      <header className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-gray-500">Doctor portal</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl font-extrabold tracking-tightest text-gray-900 dark:text-white">Scan Patient QR</h1>
        <p className="mt-2 max-w-2xl text-gray-500 dark:text-gray-400">
          Enter a patient&apos;s NephroSasa share token or paste their share URL to access their health record.
        </p>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Camera */}
        <section className="relative overflow-hidden rounded-3xl bg-ink p-6 sm:p-8 text-white flex flex-col dark:ring-1 dark:ring-white/10">
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
          <div className="relative flex flex-1 flex-col">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">Camera</p>
            {!isScanning ? (
              <>
                <div className="my-8 flex flex-1 items-center justify-center">
                  <div className="relative grid h-40 w-40 place-items-center">
                    <span className="absolute left-0 top-0 h-8 w-8 rounded-tl-2xl border-l-2 border-t-2 border-primary-light" />
                    <span className="absolute right-0 top-0 h-8 w-8 rounded-tr-2xl border-r-2 border-t-2 border-primary-light" />
                    <span className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-2xl border-b-2 border-l-2 border-primary-light" />
                    <span className="absolute bottom-0 right-0 h-8 w-8 rounded-br-2xl border-b-2 border-r-2 border-primary-light" />
                    <QrCode size={64} className="text-white/80" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={startScanner}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-ink transition-transform hover:-translate-y-0.5"
                >
                  <Camera size={19} /> Scan with Camera
                </button>
              </>
            ) : (
              <div className="mt-6">
                <div id="reader" className="w-full overflow-hidden rounded-2xl bg-black" />
                <button
                  type="button"
                  onClick={stopScanner}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  <X size={18} /> Cancel Scanning
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Manual */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 flex flex-col dark:border-white/10 dark:bg-gray-900">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gray-500">Or enter it yourself</p>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col">
            <label htmlFor="tokenInput" className="text-sm font-semibold text-gray-900 dark:text-white">
              Patient Share Token or URL
            </label>
            <input
              id="tokenInput"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Enter token (e.g. abc123...) or paste full share URL"
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-mono text-sm text-gray-900 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
            {error && <p className="mt-2 text-sm text-red-600 dark:text-red-300">{error}</p>}
            <button
              type="submit"
              className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-primary-dark"
            >
              Access Patient Record
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>

            <div className="mt-8 border-t border-gray-100 pt-6 dark:border-white/5">
              <p className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                <Info size={16} className="text-primary" /> How to get a patient&apos;s token
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                Ask your patient to go to <span className="font-semibold text-gray-700 dark:text-gray-200">Share Record</span> in their NephroSasa portal and share their QR code or copy their share URL. You can then paste it here or scan the QR code to instantly access their kidney health history.
              </p>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
