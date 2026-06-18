'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Stethoscope, ArrowRight, Shield, QrCode } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function RegisterChoicePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200 p-4 md:p-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
         
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Join NephroSasa Rwanda
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Select your account type to get started. Monitor your kidney health proactively.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Patient Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 md:p-4 bg-blue-100 dark:bg-blue-900/40 rounded-2xl mb-4 md:mb-6">
                <User size={40} className="text-primary" />
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                I'm a Patient
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-6 text-sm md:text-base">
                Create a personal account to manage your health records, 
                get your QR code, and access care anywhere in Rwanda.
              </p>
              
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 text-left w-full">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 md:p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <QrCode size={18} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm md:text-base">QR Code Access</h4>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">One scan at any healthcare facility</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 md:p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <Shield size={18} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm md:text-base">Privacy Control</h4>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">You decide who sees your records</p>
                  </div>
                </div>
              </div>
              
              <Link href="/en/register/patient" className="w-full">
                <Button 
                  variant="primary" 
                  size="lg" 
                  fullWidth 
                  className="group text-sm md:text-base"
                >
                  Register as Patient
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
              </Link>
              
              <p className="mt-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                Free forever • No hidden fees
              </p>
            </div>
          </div>

          {/* Healthcare Provider Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 md:p-4 bg-blue-100 dark:bg-blue-900/40 rounded-2xl mb-4 md:mb-6">
                <Stethoscope size={40} className="text-primary" />
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                I'm a Doctor / Nephrologist
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-6 text-sm md:text-base">
                Register your RMDC credentials to monitor patient kidney health, 
                conduct remote consultations, and receive alerts.
              </p>
              
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 text-left w-full">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 md:p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <Stethoscope size={18} className="text-primary" />
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm md:text-base">Complete Records</h4>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Access full patient medical histories</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 md:p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <ArrowRight size={18} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm md:text-base">Digital Payments</h4>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Process MTN & Airtel Mobile Money</p>
                  </div>
                </div>
              </div>
              
              <Link href="/en/register/doctor" className="w-full">
                <Button 
                  variant="primary" 
                  size="lg" 
                  fullWidth 
                  className="group text-sm md:text-base"
                >
                  Register as Doctor
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
              </Link>
              
              <p className="mt-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                For registered doctors and nephrologists (RMDC required)
              </p>
            </div>
          </div>
        </div>

        {/* Already have account */}
        <div className="text-center mt-8 md:mt-12">
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Already have an account?{' '}
            <Link href="/en/login" className="text-primary font-semibold hover:text-primary-dark">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}