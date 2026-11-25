'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, Lock, Clock, Stethoscope } from 'lucide-react';
import ZoomImage from '@/components/motion/ZoomImage';

// Counts up once when the number scrolls into view
const AnimatedCounter = ({ end, suffix = '', prefix = '', duration = 1800 }: { end: number; suffix?: string; prefix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setCount(Math.round(end * eased));
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [end, duration]);

  return (
    <span ref={ref} className="tabular">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const stats = [
  { value: 1000, suffix: '+', label: 'Active Patients' },
  { value: 50, suffix: '+', label: 'Healthcare Providers' },
  { value: 85, suffix: '%', label: 'Time Saved' },
  { value: 5, suffix: 'M+', label: 'Costs Prevented', prefix: '₣' },
];

const features = [
  { title: 'Longitudinal Vital Tracking', description: 'Track your blood pressure and blood sugar readings across multiple clinic visits over time' },
  { title: 'AI Kidney Risk Scoring', description: 'Predictive Random Forest machine learning model analyzes your vital trajectory to detect silent kidney decline' },
  { title: 'Remote Nephrologist Consultation', description: 'Connect directly with Kigali-based specialists without leaving your district when alerts trigger' },
  { title: 'QR Health Record Sharing', description: 'Securely share your longitudinal health records with any doctor instantly via a QR scan' },
  { title: 'Mobile Money Payments', description: 'Pay for remote specialist consultations seamlessly using MTN Mobile Money or Airtel Money' },
  { title: 'SMS Reminders', description: "Automated 7-day and 14-day Africa's Talking SMS alerts ensure you never miss logging your vitals" },
];

const steps = [
  {
    title: 'Register & Get Your Personal QR Code',
    body: 'Create your free account in under 2 minutes. We verify your identity and generate a unique QR code that securely represents your medical identity.',
    points: ['Free forever for patients', '2-minute registration', 'Secure identity verification', 'Instant QR generation'],
    image: '/images/step-1.jpg',
    alt: 'Patient registering on a phone',
  },
  {
    title: 'Visit Any Healthcare Facility',
    body: 'Show your QR code at any registered clinic or hospital. The doctor scans it, requests access to your records, and you approve instantly from your phone.',
    points: ['Works at any registered facility', 'Patient-controlled access', 'Real-time approval', 'Audit trail for privacy'],
    image: '/images/doctors/doctor-2.jpg',
    alt: 'Doctor ready to scan a patient QR code',
  },
  {
    title: 'Seamless Care & Payment',
    body: 'Doctor sees your complete history, provides informed care. Pay instantly via mobile money, receive digital receipts, and your records are updated automatically.',
    points: ['Complete medical history view', 'Mobile money payments', 'Digital receipts', 'Auto-updated records'],
    image: '/images/step-3.jpg',
    alt: 'Paying for a consultation with a phone',
  },
];

export default function HomePage() {
  return (
    <div className="bg-white dark:bg-ink text-gray-900 dark:text-gray-100">
      {/* Hero (kept as the original) */}
      <section className="relative min-h-[600px] md:min-h-[700px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/hero.jpg"
            alt="Modern healthcare facility in Rwanda"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Dark Overlay for text readability (no blue tint) */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex items-center min-h-[600px] md:min-h-[700px]">
          <div className="max-w-4xl text-white">

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 md:mb-8">
              Monitor Your Kidneys.
              <span className="block mt-2 bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
                Before It's Too Late.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 text-blue-100 max-w-3xl leading-relaxed">
              Longitudinal, AI-powered pre-dialysis kidney health monitoring platform for Rwandan adults with hypertension or Type 2 diabetes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 md:mb-12">
              <Link href="/en/register/patient">
                <button className="group bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-0.5 w-full sm:w-auto">
                  <span>Register as Patient</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              </Link>
              
              <Link href="/en/register/doctor">
                <button className="group bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto">
                  <Stethoscope size={20} />
                  <span>Register as Doctor</span>
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 text-blue-100">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Check size={18} className="text-green-300" />
                </div>
                <span className="font-medium">Free for Patients</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Check size={18} className="text-green-300" />
                </div>
                <span className="font-medium">Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Check size={18} className="text-green-300" />
                </div>
                <span className="font-medium">Ministry Approved</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Check size={18} className="text-green-300" />
                </div>
                <span className="font-medium">AI-Powered Insights</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ink-2 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl lg:text-5xl font-bold tracking-tight">
                <AnimatedCounter end={s.value} suffix={s.suffix} prefix={s.prefix} />
              </p>
              <p className="mt-1 text-sm text-blue-200/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why NephroSasa */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tightest leading-[0.95]">
            Why choose NephroSasa.
            <span className="block text-gray-400 dark:text-gray-500">Transform healthcare experience.</span>
          </h2>

          <div className="mt-14 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-start">
            <ZoomImage src="/images/testimonial/husband-and-wife.jpg" alt="A couple at home checking their health readings on a laptop" className="aspect-[4/3] rounded-3xl lg:sticky lg:top-24" imgClassName="object-center" sizes="(max-width: 1024px) 100vw, 900px" />
            <ul className="border-t border-gray-200 dark:border-gray-800">
              {features.map((f) => (
                <li key={f.title} className="group border-b border-gray-200 dark:border-gray-800 py-6 transition-[padding] duration-300 hover:pl-3">
                  <h3 className="flex items-center justify-between gap-4 text-xl lg:text-2xl font-bold">
                    {f.title}
                    <ArrowRight size={20} className="text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </h3>
                  <p className="mt-2 max-w-xl text-gray-600 dark:text-gray-400">{f.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 lg:py-32 bg-gray-50 dark:bg-gray-950 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tightest leading-[0.95]">
            Simple, secure process.
            <span className="block text-gray-400 dark:text-gray-500">Three steps to better healthcare management.</span>
          </h2>

          <div className="mt-16 space-y-24 lg:space-y-32">
            {steps.map((s, i) => (
              <div key={s.title} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <ZoomImage src={s.image} alt={s.alt} className={`aspect-[4/3] rounded-3xl ${i % 2 ? '' : 'lg:order-2'}`} />
                <div>
                  <p className="font-mono text-sm text-primary">Step {i + 1} of 3</p>
                  <h3 className="mt-3 text-3xl lg:text-4xl font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-5 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{s.body}</p>
                  <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300">
                        <Check size={17} className="text-primary flex-shrink-0" />{p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="bg-ink text-white py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="font-mono text-sm text-primary-light">Security first</p>
            <h2 className="mt-4 font-display text-4xl lg:text-5xl font-extrabold tracking-tightest leading-[0.95]">
              Built with Rwanda&apos;s trust &amp; security standards
            </h2>
            <p className="mt-6 text-lg text-gray-300 max-w-xl">
              Your health data is protected with enterprise-grade security measures compliant with Rwanda&apos;s Data Protection Law and Ministry of Health guidelines.
            </p>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 border-t border-white/10">
              <div className="py-6 sm:pr-6">
                <Lock size={20} className="text-primary-light" />
                <h3 className="mt-4 text-xl font-bold">256-bit Encryption</h3>
                <p className="mt-1 text-gray-400">Military-grade data protection</p>
              </div>
              <div className="py-6 sm:pl-6 border-t sm:border-t-0 sm:border-l border-white/10">
                <Clock size={20} className="text-primary-light" />
                <h3 className="mt-4 text-xl font-bold">Real-time Audit Trail</h3>
                <p className="mt-1 text-gray-400">Track every access to your records</p>
              </div>
            </div>
          </div>
          <ZoomImage src="/images/others/about-2.jpg" alt="NephroSasa clinicians reviewing patient records" className="aspect-[4/3] lg:aspect-[5/4] rounded-3xl" />
        </div>
      </section>

      {/* Closing call to action */}
      <section className="relative overflow-hidden text-white">
        <ZoomImage src="/images/others/cta-healthcare.jpg" alt="" className="absolute inset-0" imgClassName="object-[70%_30%]" sizes="100vw" from={1.04} />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/0" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tightest leading-[0.95] max-w-3xl">
            Ready to monitor your kidney health?
          </h2>
          <p className="mt-6 text-lg text-gray-300 max-w-xl">
            Join thousands of Rwandans using NephroSasa for proactive kidney monitoring.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link href="/en/register/patient" className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-7 py-4 font-semibold text-ink transition-all hover:-translate-y-0.5">
              Register as Patient
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/en/register/doctor" className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/30 px-7 py-4 font-semibold transition-all hover:border-white hover:-translate-y-0.5">
              Register as Doctor
            </Link>
          </div>
          <p className="mt-8 text-sm text-gray-400">No credit card required · Free forever for patients · 24/7 support</p>
        </div>
      </section>
    </div>
  );
}
