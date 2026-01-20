'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';

export default function RegistrationSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to login after 5 seconds
    const timer = setTimeout(() => {
      router.push('/en/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={48} className="text-white" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Account Created Successfully!
        </h1>
        
        <p className="text-gray-600 mb-8 text-lg">
          Welcome to HealthVault Rwanda. Your account has been created and is ready to use.
        </p>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Shield size={24} className="text-primary" />
            <span className="font-semibold text-gray-900">Account Verification Needed</span>
          </div>
          <p className="text-sm text-gray-600">
            Please note: Your account will be fully activated after verification by our team. This usually takes 24-48 hours. You can still login, but some features may be limited.
          </p>
        </div>

        {/* Next Steps */}
        <div className="space-y-4">
          <Link href="/en/login" className="block">
            <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-3">
              Login to Your Account
              <ArrowRight size={20} />
            </button>
          </Link>

          <Link href="/en" className="block">
            <button className="w-full border-2 border-primary text-primary font-semibold py-4 rounded-xl hover:bg-primary/5 transition-all">
              Back to Homepage
            </button>
          </Link>
        </div>

        {/* Auto-redirect notice */}
        <p className="text-sm text-gray-500 mt-8">
          Redirecting to login page in 5 seconds...
        </p>
      </div>
    </div>
  );
}