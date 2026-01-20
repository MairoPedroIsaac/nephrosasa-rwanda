'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, QrCode, Shield, Smartphone, Check, User, CreditCard } from 'lucide-react';

export default function PatientRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Step 2
    nationalId: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    province: '',
    district: '',
    
    // Step 3
    emergencyContact: '',
    emergencyPhone: '',
    acceptTerms: false,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Submit logic here
    setTimeout(() => {
      setLoading(false);
      router.push('/en/patient/dashboard');
    }, 1500);
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left Side - Hero Image (55%) */}
      <div className="lg:w-[55%] relative min-h-[50vh] lg:min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/registeration/registeration-image.jpg"
            alt="Healthcare professional in Rwanda - HealthVault Rwanda"
            fill
            priority
            className="object-cover object-[center_25%]"
            quality={100}
            sizes="55vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col p-6 md:p-8 lg:p-12 text-white">
          {/* Main Hero Content - Desktop */}
          <div className="hidden lg:flex flex-1 flex-col justify-center max-w-xl mx-auto w-full">
            <div className="mb-8 lg:mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
                Your Health Journey
                <span className="block text-white mt-2">Starts Here</span>
              </h2>
            </div>

            {/* Patient Benefits Grid */}
            <div className="space-y-4 mb-8">
              <div className="bg-white/15 backdrop-blur-sm p-4 rounded-xl border border-white/25">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/25 rounded-lg">
                    <QrCode size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Your Personal QR Code</h3>
                    <p className="text-white/80 text-sm">
                      Instant access at any healthcare facility
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur-sm p-4 rounded-xl border border-white/25">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/25 rounded-lg">
                    <Shield size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Complete Privacy Control</h3>
                    <p className="text-white/80 text-sm">
                      You decide who sees your records
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur-sm p-4 rounded-xl border border-white/25">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/25 rounded-lg">
                    <CreditCard size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Always Free for Patients</h3>
                    <p className="text-white/80 text-sm">
                      No hidden fees, ever
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="border-t border-white/25 pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-white/90">Ministry Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-white/90">256-bit Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-white/90">Data Protected</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-white" />
                    <span className="text-sm font-medium">Trusted by 1,000+ Rwandans</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-only content */}
          <div className="lg:hidden flex-1 flex flex-col items-center justify-center pt-8">
            <div className="grid grid-cols-1 gap-4 mb-8 w-full max-w-xs mx-auto">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                <div className="flex flex-col items-center text-center">
                  <div className="p-2 bg-white/25 rounded-lg mb-2">
                    <QrCode size={20} className="text-white" />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">Your Personal QR Code</h3>
                  <p className="text-white/90 text-xs">
                    Instant access at any healthcare facility
                  </p>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                <div className="flex flex-col items-center text-center">
                  <div className="p-2 bg-white/25 rounded-lg mb-2">
                    <Shield size={20} className="text-white" />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">Complete Privacy Control</h3>
                  <p className="text-white/90 text-xs">
                    You decide who sees your records
                  </p>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                <div className="flex flex-col items-center text-center">
                  <div className="p-2 bg-white/25 rounded-lg mb-2">
                    <CreditCard size={20} className="text-white" />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">Always Free for Patients</h3>
                  <p className="text-white/90 text-xs">
                    No hidden fees, ever
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

      {/* Right Side - Registration Form (45%) */}
      <div className="lg:w-[45%] flex items-start justify-center pt-12 lg:pt-24 p-6 sm:p-8 lg:p-14 bg-white">
        <div className="w-full max-w-lg">
          {/* Mobile Header - CENTERED ICON LIKE LOGIN */}
          <div className="lg:hidden mb-10">
            <div className="flex flex-col items-center text-center mb-8">
              {/* Centered Blue Icon Container - MATCHED TO LOGIN (mb-3) */}
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <User className="text-white" size={24} />
                </div>
              </div>
              
              {/* Text Content */}
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Patient Registration
              </h2>
              <p className="text-gray-600 text-lg">
                Create your HealthVault account
              </p>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Patient Registration
            </h2>
            <p className="text-gray-600 text-lg">
              Create your HealthVault account
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Step {step} of 3</span>
              <span className="text-sm text-gray-500">
                {step === 1 && 'Personal Info'}
                {step === 2 && 'Health Details'}
                {step === 3 && 'Emergency & Terms'}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {step === 1 && 'Create Your Account'}
              {step === 2 && 'Health Information'}
              {step === 3 && 'Emergency & Terms'}
            </h3>
            <p className="text-gray-600">
              {step === 1 && 'Enter your personal information to get started'}
              {step === 2 && 'Help us personalize your health experience'}
              {step === 3 && 'Set up emergency contact and accept terms'}
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                      placeholder="078 123 4567"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Health Details */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-2">
                    National ID / Passport Number *
                  </label>
                  <input
                    id="nationalId"
                    type="text"
                    value={formData.nationalId}
                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                    placeholder="11998800112233"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                      required
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Group
                    </label>
                    <select
                      id="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                    >
                      <option value="">Optional</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                      Province *
                    </label>
                    <select
                      id="province"
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                      required
                    >
                      <option value="">Select Province</option>
                      <option value="kigali">Kigali City</option>
                      <option value="south">Southern Province</option>
                      <option value="west">Western Province</option>
                      <option value="north">Northern Province</option>
                      <option value="east">Eastern Province</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Emergency & Terms */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Name *
                  </label>
                  <input
                    id="emergencyContact"
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                    placeholder="Full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Phone *
                  </label>
                  <input
                    id="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                    placeholder="078 123 4567"
                    required
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <input
                      id="acceptTerms"
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                      className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/30"
                      required
                    />
                    <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                      I agree to the{' '}
                      <Link href="/en/terms" className="text-primary font-medium hover:text-primary-dark">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/en/privacy" className="text-primary font-medium hover:text-primary-dark">
                        Privacy Policy
                      </Link>
                      . I understand that I control access to my health records.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-primary text-white font-medium py-3 rounded-xl hover:bg-primary-dark transition-colors"
                >
                  Continue
                  <ArrowRight className="inline-block ml-2" size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-white font-medium py-3 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-70"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                      Creating Account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Already have account */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <Link href="/en/login" className="text-primary font-medium hover:text-primary-dark">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Security Assurance */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Shield size={16} className="text-gray-600" />
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Your data is protected with 256-bit encryption
              </p>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Compliant with Rwanda's Data Protection Law
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}