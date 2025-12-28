/**
 * Landing Page (Homepage)
 * Main entry point - shows hero section, features, stats, how it works
 */

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Smartphone, Brain, Lock, QrCode, CreditCard, Users, Building2, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary-dark text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Your Health Records, <span className="text-accent">Securely Connected</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-blue-100">
                Access your complete medical history across all healthcare facilities in Rwanda. Control your data, improve your care.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/en/register/patient">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Register as Patient
                  </Button>
                </Link>
                
                <Link href="/en/register/provider">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary">
                    Register as Provider
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-6 text-sm text-blue-100">
                <div className="flex items-center gap-2">
                  <Shield size={20} />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock size={20} />
                  <span>End-to-End Encrypted</span>
                </div>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative h-96 lg:h-[500px]">
              <Image
                src="/images/hero/hero.jpg"
                alt="Healthcare professional using digital health records"
                fill
                className="object-cover rounded-2xl shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
            <path fill="#F9FAFB" fillOpacity="1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Building2 size={48} className="text-primary" />
              </div>
              <h3 className="text-4xl font-bold text-primary mb-2">10+</h3>
              <p className="text-gray-600">Healthcare Facilities</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users size={48} className="text-accent" />
              </div>
              <h3 className="text-4xl font-bold text-accent mb-2">1,000+</h3>
              <p className="text-gray-600">Patients Registered</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <FileText size={48} className="text-success" />
              </div>
              <h3 className="text-4xl font-bold text-success mb-2">5,000+</h3>
              <p className="text-gray-600">Medical Records Stored</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why HealthVault Rwanda?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Modern healthcare technology designed for Rwanda's unique needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <Card hover className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary bg-opacity-10 rounded-full">
                  <QrCode size={32} className="text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">QR Code Access</h3>
              <p className="text-gray-600">
                Show your QR code at any clinic. Doctors instantly see your medical history.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card hover className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-accent bg-opacity-10 rounded-full">
                  <Smartphone size={32} className="text-accent" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile Money Payments</h3>
              <p className="text-gray-600">
                Pay consultation fees via MTN or Airtel Money. Instant receipts.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card hover className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-success bg-opacity-10 rounded-full">
                  <Brain size={32} className="text-success" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Health Alerts</h3>
              <p className="text-gray-600">
                Our system detects health patterns and alerts your doctor early.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card hover className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-warning bg-opacity-10 rounded-full">
                  <Lock size={32} className="text-warning" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                You control who sees your records. All data encrypted.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, secure, and designed for everyone
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* QR Code Image */}
            <div className="relative h-80 lg:h-96">
              <Image
                src="/images/qr code/QR code.png"
                alt="Doctor scanning patient QR code"
                fill
                className="object-contain"
              />
            </div>

            {/* Steps */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Register & Get Your QR Code</h3>
                  <p className="text-gray-600">
                    Create your account and receive a unique QR code. This is your key to accessing your medical records anywhere.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Visit Any Facility</h3>
                  <p className="text-gray-600">
                    Show your QR code at any registered clinic or hospital. The doctor scans it and requests access to your records.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-success text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Receive Better Care</h3>
                  <p className="text-gray-600">
                    Your doctor sees your complete medical history, makes informed decisions, and updates your records. Pay seamlessly with mobile money.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <Card className="relative">
              <div className="flex items-start gap-4 mb-4">
                <Image
                  src="/images/testimonial/husband-and-wife.jpg"
                  alt="Patient testimonial"
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-lg">Jean & Marie Uwimana</h4>
                  <p className="text-gray-600 text-sm">Patients, Kigali</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "HealthVault has transformed how we manage our family's health. No more carrying paper files or explaining our medical history repeatedly. Everything is in one place!"
              </p>
            </Card>

            {/* Testimonial 2 */}
            <Card className="relative">
              <div className="flex items-start gap-4 mb-4">
                <Image
                  src="/images/doctors/doctor-1.jpg"
                  alt="Doctor testimonial"
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-lg">Dr. Grace Mukamana</h4>
                  <p className="text-gray-600 text-sm">General Practitioner, Kigali Clinic</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "As a doctor, having instant access to patient history saves time and improves diagnosis accuracy. The AI alerts help me identify at-risk patients early."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Take Control of Your Health Records?
          </h2>
          <p className="text-lg mb-8 text-blue-100">
            Join thousands of Rwandans using HealthVault for better healthcare
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/en/register/patient">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100">
                Get Started as Patient
              </Button>
            </Link>
            
            <Link href="/en/register/provider">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-primary">
                Register Your Facility
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}