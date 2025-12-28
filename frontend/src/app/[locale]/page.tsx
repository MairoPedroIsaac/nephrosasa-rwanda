'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Shield, Smartphone, Brain, QrCode, ArrowRight, Check, 
  Stethoscope, Zap, Lock, FileText, Users, Globe, 
  Award, Clock, ShieldCheck, ChevronRight, ChevronLeft
} from 'lucide-react';

// Animated Counter Component
const AnimatedCounter = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setHasAnimated(true);
              let start = 0;
              const increment = end / (duration / 16); // 60fps
              
              const timer = setInterval(() => {
                start += increment;
                if (start > end) {
                  setCount(end);
                  clearInterval(timer);
                } else {
                  setCount(Math.floor(start));
                }
              }, 16);
            }
          });
        },
        { threshold: 0.5 }
      );

      const element = document.getElementById(`counter-${end}`);
      if (element) observer.observe(element);

      return () => observer.disconnect();
    }
  }, [end, duration, hasAnimated]);

  return (
    <div id={`counter-${end}`} className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
      {count.toLocaleString()}{suffix}
    </div>
  );
};

export default function HomePage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  const stats = [
    { value: 1000, suffix: '+', label: 'Active Patients' },
    { value: 50, suffix: '+', label: 'Healthcare Providers' },
    { value: 85, suffix: '%', label: 'Time Saved' },
    { value: 5, suffix: 'M+', label: 'Costs Prevented', prefix: '₣' },
  ];

  const features = [
    {
      icon: QrCode,
      title: 'Instant QR Access',
      description: 'One scan gives doctors your complete medical history instantly',
      color: 'from-blue-500 to-cyan-400',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50'
    },
    {
      icon: Smartphone,
      title: 'Mobile Money Payments',
      description: 'Seamless MTN & Airtel Money integration with instant receipts',
      color: 'from-emerald-500 to-green-400',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50'
    },
    {
      icon: Brain,
      title: 'AI Health Insights',
      description: 'Predictive analytics that detect patterns for early intervention',
      color: 'from-violet-500 to-purple-400',
      bgColor: 'bg-gradient-to-br from-violet-50 to-purple-50'
    },
    {
      icon: Shield,
      title: 'Military-Grade Security',
      description: '256-bit encryption with patient-controlled access permissions',
      color: 'from-indigo-500 to-blue-400',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-50'
    },
    {
      icon: FileText,
      title: 'Digital Records',
      description: 'Replace paper files with secure, accessible digital records',
      color: 'from-amber-500 to-orange-400',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50'
    },
    {
      icon: Users,
      title: 'Provider Network',
      description: 'Connected healthcare ecosystem across Rwanda',
      color: 'from-rose-500 to-pink-400',
      bgColor: 'bg-gradient-to-br from-rose-50 to-pink-50'
    },
  ];

  const scrollToFeature = (index: number) => {
    setCurrentFeature(index);
    if (featuresRef.current) {
      const cardWidth = featuresRef.current.children[0]?.clientWidth || 0;
      featuresRef.current.scrollTo({
        left: index * (cardWidth + 32),
        behavior: 'smooth'
      });
    }
  };

  const nextFeature = () => {
    if (currentFeature < features.length - 1) {
      scrollToFeature(currentFeature + 1);
    }
  };

  const prevFeature = () => {
    if (currentFeature > 0) {
      scrollToFeature(currentFeature - 1);
    }
  };

  return (
    <div className="bg-white">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/hero.jpg"
            alt="Modern healthcare facility in Rwanda"
            fill
            className="object-cover object-center"
            priority
            quality={100}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-blue-800/75 to-blue-900/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-blue-900/40" />
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white font-medium">Trusted by 1,000+ Rwandans</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8">
              Your Health Records,
              <span className="block mt-2 bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
                Securely Connected
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl mb-10 text-white/90 max-w-3xl leading-relaxed">
              Access your complete medical history across all healthcare facilities in Rwanda. 
              One platform. Complete control. Better care outcomes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/en/register/patient">
                <button className="group bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-0.5">
                  <span>Get Started Free</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              </Link>
              
              <Link href="/en/register/provider">
                <button className="group bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3">
                  <Stethoscope size={20} />
                  <span>Join as Provider</span>
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 text-white/90">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Check size={18} className="text-green-300" />
                </div>
                <span className="font-medium">Free for Patients</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Check size={18} className="text-green-300" />
                </div>
                <span className="font-medium">Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Check size={18} className="text-green-300" />
                </div>
                <span className="font-medium">Ministry Approved</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Check size={18} className="text-green-300" />
                </div>
                <span className="font-medium">AI-Powered Insights</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="text-white rotate-90" size={24} />
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <AnimatedCounter 
                  end={stat.value} 
                  suffix={stat.suffix} 
                  duration={2000 + index * 500}
                />
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid with Mobile Carousel */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full mb-6">
              <Award size={16} />
              <span className="text-sm font-semibold">Why Choose HealthVault</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Transform Healthcare Experience
            </h2>
            <p className="text-xl text-gray-600">
              Combining cutting-edge technology with Rwanda's healthcare vision
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`${feature.bgColor} p-8 rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6`}>
                  <feature.icon size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                  <span>Learn more</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden relative">
            {/* Navigation Arrows */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={prevFeature}
                disabled={currentFeature === 0}
                className={`p-3 rounded-full ${currentFeature === 0 ? 'text-gray-300' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="flex gap-2">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToFeature(index)}
                    className={`w-2 h-2 rounded-full ${currentFeature === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextFeature}
                disabled={currentFeature === features.length - 1}
                className={`p-3 rounded-full ${currentFeature === features.length - 1 ? 'text-gray-300' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Carousel Container */}
            <div 
              ref={featuresRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-8 pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0 w-[calc(100vw-4rem)] snap-center"
                >
                  <div className={`${feature.bgColor} p-8 rounded-2xl border border-gray-100`}>
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6`}>
                      <feature.icon size={28} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 mb-6">{feature.description}</p>
                    <div className="flex items-center gap-2 text-blue-600 font-semibold">
                      <span>Learn more</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Indicator */}
            <div className="text-center mt-4 text-sm text-gray-500">
              {currentFeature + 1} / {features.length}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced with Fixed Images */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Simple, Secure Process
            </h2>
            <p className="text-xl text-gray-600">
              Three steps to better healthcare management
            </p>
          </div>

          <div className="space-y-32">
            {/* Step 1 - Fixed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-full mb-6">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">1</div>
                  <span className="font-bold">STEP 1</span>
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold mb-6">Register & Get Your Personal QR Code</h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Create your free account in under 2 minutes. We verify your identity and 
                  generate a unique QR code that securely represents your medical identity.
                </p>
                <ul className="space-y-4">
                  {['Free forever for patients', '2-minute registration', 'Secure identity verification', 'Instant QR generation'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check size={20} className="text-green-500" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative h-80 lg:h-96 order-1 lg:order-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl" />
                <Image
                  src="/images/step-1.jpg"
                  alt="Patient registration on mobile"
                  fill
                  className="object-cover rounded-3xl shadow-2xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Step 2 - Fixed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative h-80 lg:h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-3xl blur-xl" />
                <Image
                  src="/images/doctors/doctor-2.jpg"
                  alt="Doctor scanning QR code"
                  fill
                  className="object-cover rounded-3xl shadow-2xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div>
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white px-6 py-3 rounded-full mb-6">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">2</div>
                  <span className="font-bold">STEP 2</span>
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold mb-6">Visit Any Healthcare Facility</h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Show your QR code at any registered clinic or hospital. The doctor scans it, 
                  requests access to your records, and you approve instantly from your phone.
                </p>
                <ul className="space-y-4">
                  {['Works at any registered facility', 'Patient-controlled access', 'Real-time approval', 'Audit trail for privacy'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check size={20} className="text-green-500" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step 3 - Fixed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-violet-600 to-purple-500 text-white px-6 py-3 rounded-full mb-6">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">3</div>
                  <span className="font-bold">STEP 3</span>
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold mb-6">Seamless Care & Payment</h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Doctor sees your complete history, provides informed care. Pay instantly via 
                  mobile money, receive digital receipts, and your records are updated automatically.
                </p>
                <ul className="space-y-4">
                  {['Complete medical history view', 'Mobile money payments', 'Digital receipts', 'Auto-updated records'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check size={20} className="text-green-500" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative h-80 lg:h-96 order-1 lg:order-2">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-3xl blur-xl" />
                <Image
                  src="/images/step-3.jpg"
                  alt="QR code payment and records"
                  fill
                  className="object-cover rounded-3xl shadow-2xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="py-24 bg-gradient-to-br from-blue-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
                <ShieldCheck size={16} />
                <span className="text-sm font-semibold">Security First</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-8">
                Built with Rwanda's Trust & Security Standards
              </h2>
              <p className="text-xl text-blue-100 mb-10">
                Your health data is protected with enterprise-grade security measures 
                compliant with Rwanda's Data Protection Law and Ministry of Health guidelines.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                  <Lock size={24} className="text-cyan-300 mb-4" />
                  <h3 className="text-xl font-bold mb-2">256-bit Encryption</h3>
                  <p className="text-blue-200/80">Military-grade data protection</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                  <Clock size={24} className="text-cyan-300 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Real-time Audit Trail</h3>
                  <p className="text-blue-200/80">Track every access to your records</p>
                </div>
              </div>
            </div>
            
            <div className="relative h-80 lg:h-[500px]">
              <Image
                src="/images/others/about-2.jpg"
                alt="Secure healthcare technology"
                fill
                className="object-cover rounded-3xl"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent rounded-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section with Fixed Image */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero-1.jpg"
            alt="Rwandan healthcare professionals"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/85 to-cyan-900/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-blue-900/30" />
        </div>

        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-600/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
            <Users size={20} className="text-white" />
            <span className="text-white font-semibold">Join Rwanda's Digital Health Revolution</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Ready to Transform Healthcare?
          </h2>
          
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of Rwandans and healthcare providers already using HealthVault 
            for better, faster, and more secure healthcare.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/en/register/patient">
              <button className="group bg-gradient-to-r from-white to-gray-100 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-3">
                <span>Start Free as Patient</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </Link>
            
            <Link href="/en/register/provider">
              <button className="group bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                <Stethoscope size={20} />
                <span>Register as Provider</span>
              </button>
            </Link>
          </div>
          
          <p className="mt-8 text-white/70">
            No credit card required • Free forever for patients • 24/7 support
          </p>
        </div>
      </section>

      {/* Add custom CSS for hiding scrollbar */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}