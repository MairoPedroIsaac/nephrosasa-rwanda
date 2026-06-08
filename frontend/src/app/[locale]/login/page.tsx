'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from '@/lib/auth';
import { ArrowRight, Shield, Zap, Smartphone, Lock, Check, Mail, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);

    if (result.success) {
      if (result.user?.user_type === 'DOCTOR') {
        router.push('/en/doctor/dashboard');
      } else {
        router.push('/en/patient/dashboard');
      }
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
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

              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                <div className="flex flex-col items-center text-center">
                  <div className="p-2 bg-white/25 rounded-lg mb-2">
                    <Zap size={20} className="text-white" />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">24/7 Access</h3>
                  <p className="text-white/90 text-xs">
                    Health records available anytime
                  </p>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                <div className="flex flex-col items-center text-center">
                  <div className="p-2 bg-white/25 rounded-lg mb-2">
                    <Smartphone size={20} className="text-white" />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">Mobile Payments</h3>
                  <p className="text-white/90 text-xs">
                    MTN & Airtel Money integration
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
              
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-white/90">MoH Approved</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-white/90">RDPA Compliant</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-white/90">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form (45%) */}
      <div className="lg:w-[45%] flex items-start justify-center pt-12 lg:pt-24 p-6 sm:p-8 lg:p-14 bg-white">
        <div className="w-full max-w-lg">
          {/* Mobile-only Header with Icon - ADJUSTED SPACING */}
          <div className="lg:hidden mb-10">
            <div className="flex flex-col items-center text-center mb-8">
              {/* Blue Icon Container - Reduced bottom margin from mb-5 to mb-3 */}
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Lock className="text-white" size={24} />
                </div>
              </div>
              
              {/* Text Content */}
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Secure Login
              </h2>
              <p className="text-gray-600 text-lg">
                Sign in to access your health records
              </p>
            </div>
          </div>

          {/* Desktop Header (unchanged) */}
          <div className="hidden lg:block mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Secure Login
            </h2>
            <p className="text-gray-600 text-lg">
              Sign in to access your health records
            </p>
          </div>

          {/* Success Message */}
          {registered && (
            <div className="mb-8 p-5 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Check size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-800 text-lg">Account Created Successfully!</p>
                  <p className="text-green-600 text-sm mt-1">Please login to access your health records</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-5 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Lock size={20} className="text-red-600" />
                  </div>
                  <p className="text-red-700 text-base font-medium">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-7">
              <div>
                <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-3">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Mail size={22} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:ring-3 focus:ring-primary/30 focus:border-primary transition-all duration-200 placeholder:text-gray-400 text-base"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label htmlFor="password" className="block text-base font-medium text-gray-700">
                    Password *
                  </label>
                  <Link 
                    href="/en/forgot-password" 
                    className="text-base text-primary font-medium hover:text-primary-dark transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Lock size={22} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-14 pr-12 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:ring-3 focus:ring-primary/30 focus:border-primary transition-all duration-200 placeholder:text-gray-400 text-base"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold text-lg py-5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full mr-3"></span>
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Access Health Records
                  <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={22} />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-12">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-gray-500 text-base">New to NephroSasa?</span>
              </div>
            </div>
          </div>

          {/* Registration Options */}
          <div className="space-y-6">
            <Link href="/en/register">
              <button className="w-full border-2 border-primary text-primary hover:bg-primary/5 font-semibold text-lg py-4 rounded-xl transition-all duration-200">
                Create New Account
              </button>
            </Link>
            
            <div className="grid grid-cols-2 gap-5">
              <Link href="/en/register/patient">
                <button className="w-full border border-gray-300 hover:border-primary hover:bg-primary/5 text-gray-700 py-4 rounded-xl transition-all duration-200 h-auto">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-base font-medium">Patient Account</span>
                  </div>
                </button>
              </Link>
              
              <Link href="/en/register/doctor">
                <button className="w-full border border-gray-300 hover:border-primary hover:bg-primary/5 text-gray-700 py-4 rounded-xl transition-all duration-200 h-auto">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-base font-medium">Doctor / Nephrologist</span>
                  </div>
                </button>
              </Link>
            </div>
          </div>

          {/* Security Assurance */}
          <div className="mt-14 pt-10 border-t border-gray-200">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="p-3 bg-gray-100 rounded-xl">
                <Shield size={22} className="text-gray-600" />
              </div>
              <p className="text-base text-gray-600 font-semibold">
                256-bit encrypted health data protection
              </p>
            </div>
            <p className="text-sm text-gray-500 text-center">
              Compliant with Rwanda's Data Protection Law No. 058/2021
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}