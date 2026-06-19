'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Shield, Zap, Smartphone, Mail, Check } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate API call for password reset
    setTimeout(() => {
      if (email.includes('@')) {
        setSuccess(true);
      } else {
        setError('Please enter a valid email address.');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Left Side - Hero Image (55%) */}
      <div className="lg:w-[55%] relative min-h-[50vh] lg:min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/registeration/registeration-image.jpg"
            alt="Healthcare professional in Rwanda - NephroSasa Rwanda"
            fill
            priority
            className="object-cover object-[center_25%]"
            quality={100}
            sizes="55vw"
          />
          <div className="absolute inset-0 bg-black/40 z-0"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col p-6 md:p-8 lg:p-12 text-white">
          {/* Main Hero Content - Desktop */}
          <div className="hidden lg:flex flex-1 flex-col justify-end pb-12 lg:pb-16 max-w-2xl mx-auto w-full">
            {/* Feature Cards Grid - Desktop only */}
            <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="bg-white/20 backdrop-blur-sm p-5 rounded-xl border border-white/30 hover:bg-white/25 transition-colors">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-white/25 rounded-lg mb-3">
                    <Shield size={24} className="text-white" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">Bank-Level Security</h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    256-bit military-grade encryption
                  </p>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm p-5 rounded-xl border border-white/30 hover:bg-white/25 transition-colors">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-white/25 rounded-lg mb-3">
                    <Zap size={24} className="text-white" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">24/7 Access</h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    Health records available anytime
                  </p>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm p-5 rounded-xl border border-white/30 hover:bg-white/25 transition-colors">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-white/25 rounded-lg mb-3">
                    <Smartphone size={24} className="text-white" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">Mobile Payments</h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    MTN & Airtel Money integration
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badge - Desktop */}
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-3 bg-white/25 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30 mb-5">
                <Check size={18} className="text-white" />
                <span className="text-lg font-semibold">Trusted by 1,000+ Rwandans</span>
              </div>

              {/* Bottom Trust Indicators */}
              <div className="flex items-center justify-center gap-6 lg:gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white/95 font-medium">Ministry of Health Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white/95 font-medium">RDPA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white/95 font-medium">Secure Infrastructure</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-only content */}
          <div className="lg:hidden flex-1 flex flex-col items-center justify-center pt-8">
            {/* Feature Cards for Mobile */}
            <div className="grid grid-cols-1 gap-4 mb-8 w-full max-w-xs mx-auto">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                <div className="flex flex-col items-center text-center">
                  <div className="p-2 bg-white/25 rounded-lg mb-2">
                    <Shield size={20} className="text-white" />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">Bank-Level Security</h3>
                  <p className="text-white/90 text-xs">
                    256-bit military-grade encryption
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION for Mobile */}
          <div className="lg:hidden mt-auto pb-6">
            <div className="flex flex-col items-center">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 mb-4">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-white" />
                  <span className="text-sm font-medium">Trusted by 1,000+ Rwandans</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Forgot Password Form (45%) */}
      <div className="lg:w-[45%] flex items-start justify-center pt-12 lg:pt-24 p-6 sm:p-8 lg:p-14 bg-white dark:bg-gray-800 transition-colors relative">
        {/* Back to Login Button - Top Left relative to right container */}
        <div className="absolute top-6 left-6 lg:top-8 lg:left-8">
          <Link 
            href="/en/login" 
            className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Back to login
          </Link>
        </div>

        <div className="w-full max-w-lg mt-8 lg:mt-0">
          {/* Mobile-only Header with Icon */}
          <div className="lg:hidden mb-10">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Mail className="text-white" size={24} />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Reset Password
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Enter your email to receive a reset link
              </p>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Reset Password
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {success ? (
            <div className="p-8 bg-green-50 border border-green-200 rounded-2xl text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-800">Check your email</h3>
              <p className="text-green-700 text-lg">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <div className="pt-6">
                <Link href="/en/login">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-lg py-4 rounded-xl transition-colors">
                    Return to Login
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-5 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Mail size={20} className="text-red-600" />
                    </div>
                    <p className="text-red-700 text-base font-medium">{error}</p>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute left-1 top-1 bottom-1 w-12 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-l-xl pointer-events-none">
                    <Mail size={22} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-3 focus:ring-primary/30 focus:border-primary dark:focus:border-primary transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-base"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold text-lg py-5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full mr-3"></span>
                    Sending link...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Send Reset Link
                  </span>
                )}
              </button>
            </form>
          )}

          {/* Security Assurance */}
          <div className="mt-14 pt-10 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                <Shield size={22} className="text-gray-600 dark:text-gray-300" />
              </div>
              <p className="text-base text-gray-600 dark:text-gray-400 font-semibold">
                256-bit encrypted health data protection
              </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500 text-center">
              Compliant with Rwanda's Data Protection Law No. 058/2021
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
