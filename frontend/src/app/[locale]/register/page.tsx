'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Stethoscope, ArrowRight, Shield, QrCode } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function RegisterChoicePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="HealthVault Rwanda"
              width={80}
              height={80}
              className="h-16 w-16 md:h-20 md:w-20"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Join HealthVault Rwanda
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Select your account type to get started. Take control of healthcare in Rwanda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Patient Card */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 md:p-4 bg-blue-100 rounded-2xl mb-4 md:mb-6">
                <User size={40} className="text-primary" />
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                I'm a Patient
              </h2>
              
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                Create a personal account to manage your health records, 
                get your QR code, and access care anywhere in Rwanda.
              </p>
              
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 text-left w-full">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 md:p-2 bg-blue-50 rounded-lg">
                    <QrCode size={18} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm md:text-base">QR Code Access</h4>
                    <p className="text-xs md:text-sm text-gray-500">One scan at any healthcare facility</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 md:p-2 bg-blue-50 rounded-lg">
                    <Shield size={18} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm md:text-base">Privacy Control</h4>
                    <p className="text-xs md:text-sm text-gray-500">You decide who sees your records</p>
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
              
              <p className="mt-4 text-xs md:text-sm text-gray-500">
                Free forever • No hidden fees
              </p>
            </div>
          </div>

          {/* Healthcare Provider Card */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 md:p-4 bg-blue-100 rounded-2xl mb-4 md:mb-6">
                <Stethoscope size={40} className="text-primary" />
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                I'm a Healthcare Provider
              </h2>
              
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                Register your clinic or hospital to access patient records, 
                manage consultations, and process payments digitally.
              </p>
              
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 text-left w-full">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 md:p-2 bg-blue-50 rounded-lg">
                    <Stethoscope size={18} className="text-primary" />
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm md:text-base">Complete Records</h4>
                    <p className="text-xs md:text-sm text-gray-500">Access full patient medical histories</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 md:p-2 bg-green-50 rounded-lg">
                    <ArrowRight size={18} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm md:text-base">Digital Payments</h4>
                    <p className="text-xs md:text-sm text-gray-500">Process MTN & Airtel Mobile Money</p>
                  </div>
                </div>
              </div>
              
              <Link href="/en/register/provider" className="w-full">
                <Button 
                  variant="primary" 
                  size="lg" 
                  fullWidth 
                  className="group text-sm md:text-base"
                >
                  Register as Provider
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
              </Link>
              
              <p className="mt-4 text-xs md:text-sm text-gray-500">
                For clinics, hospitals & healthcare professionals
              </p>
            </div>
          </div>
        </div>

        {/* Already have account */}
        <div className="text-center mt-8 md:mt-12">
          <p className="text-gray-600 text-sm md:text-base">
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