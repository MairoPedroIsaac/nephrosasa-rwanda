'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Heart, Target, Eye, Users, Award, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AboutPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState({
    patients: 0,
    facilities: 0,
    records: 0,
    duplicateTests: 0
  });
  
  const statsRef = useRef<HTMLDivElement>(null);

  const teamMembers = [
    {
      name: 'Dr. Grace Mukamana',
      role: 'Chief Medical Officer',
      image: '/images/doctors/doctor-2.jpg',
      bio: 'Over 15 years of experience in healthcare technology and patient care.',
    },
    {
      name: 'Dr. Jean-Paul Nsengimana',
      role: 'Lead Healthcare Consultant',
      image: '/images/doctors/doctor-3.jpg',
      bio: 'Specialist in digital health transformation across East Africa.',
    },
    {
      name: 'Dr. Sarah Uwimana',
      role: 'Head of AI & Analytics',
      image: '/images/doctors/doctor-1.jpg',
      bio: 'PhD in Machine Learning applied to healthcare diagnostics.',
    },
    {
      name: 'Dr. Eric Habimana',
      role: 'Patient Experience Director',
      image: '/images/doctors/doctor-4.jpg',
      bio: 'Focused on creating accessible healthcare solutions for all Rwandans.',
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const animateCount = (start: number, end: number, duration: number, setter: (value: number) => void) => {
            const startTime = Date.now();
            const updateCount = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const current = Math.floor(start + (end - start) * progress);
              setter(current);
              if (progress < 1) {
                requestAnimationFrame(updateCount);
              }
            };
            updateCount();
          };

          animateCount(0, 1000, 2000, (value) => setStats(prev => ({ ...prev, patients: value })));
          animateCount(0, 10, 1500, (value) => setStats(prev => ({ ...prev, facilities: value })));
          animateCount(0, 5000, 2500, (value) => setStats(prev => ({ ...prev, records: value })));
          animateCount(0, 40, 2000, (value) => setStats(prev => ({ ...prev, duplicateTests: value })));
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/others/about.jpg"
            alt="NephroSasa Rwanda Team"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Monitoring Your Kidneys.
              <span className="block mt-2">Before It's Too Late.</span>
            </h1>
            <p className="text-xl text-blue-100">
              We're on a mission to detect silent kidney decline early in Rwandan adults with hypertension or Type 2 diabetes.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission */}
            <Card className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <Target size={28} className="text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide longitudinal, AI-powered pre-dialysis kidney monitoring, enabling early detection and intervention before Stage 4 or 5 Chronic Kidney Disease.
              </p>
            </Card>

            {/* Vision */}
            <Card className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-200">
                  <Eye size={28} className="text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                A Rwanda where no hypertensive or diabetic patient reaches end-stage kidney failure silently, avoiding catastrophic dialysis costs through affordable prevention.
              </p>
            </Card>

            {/* Values */}
            <Card className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                  <Heart size={28} className="text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Values</h3>
              <p className="text-gray-600 leading-relaxed">
                Privacy first. Patient empowerment. Innovation for impact. Building trust through transparency and security in everything we do.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 lg:h-[500px]">
              <Image
                src="/images/others/about-3.jpg"
                alt="Healthcare in Rwanda"
                fill
                className="object-cover rounded-2xl shadow-2xl"
              />
            </div>
            <div>
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-6">
                Born from Personal Experience
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  NephroSasa Rwanda was founded after a startling realization: over 240 new advanced Chronic Kidney Disease cases appear annually across Rwanda's referral hospitals, typically affecting adults in their most productive years.
                </p>
                <p>
                  We discovered that blood pressure and blood sugar readings were regularly captured at district NCD clinics, but no system analyzed these readings longitudinally over time. Patients were reaching irreversible Stage 5 kidney failure silently.
                </p>
                <p>
                  To solve this, we combined unified longitudinal health records with an AI Chronic Kidney Disease risk scoring engine and alert-triggered remote nephrologist consultations.
                </p>
                <p className="font-semibold text-gray-900">
                  By detecting dangerous trajectories early, we prevent catastrophic dialysis costs and save lives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section ref={statsRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact in Numbers</h2>
            <p className="text-xl text-gray-600">Making a real difference in Rwanda's healthcare system</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <Users size={28} className="text-white" />
                </div>
              </div>
              <h3 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                {stats.patients.toLocaleString()}+
              </h3>
              <p className="text-gray-600">Patients Protected</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                  <Award size={28} className="text-white" />
                </div>
              </div>
              <h3 className="text-5xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent mb-2">
                {stats.facilities}+
              </h3>
              <p className="text-gray-600">Partner Facilities</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
                  <Clock size={28} className="text-white" />
                </div>
              </div>
              <h3 className="text-5xl font-bold bg-gradient-to-r from-violet-500 to-purple-700 bg-clip-text text-transparent mb-2">
                {stats.records.toLocaleString()}+
              </h3>
              <p className="text-gray-600">Records Managed</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
                  <Heart size={28} className="text-white" />
                </div>
              </div>
              <h3 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent mb-2">
                {stats.duplicateTests}%
              </h3>
              <p className="text-gray-600">Fewer Duplicate Tests</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Team</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-6">Led by Healthcare Experts</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team combines deep healthcare expertise with cutting-edge technology skills
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8">
                <div className="relative h-80">
                  <Image
                    src={teamMembers[currentSlide].image}
                    alt={teamMembers[currentSlide].name}
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {teamMembers[currentSlide].name}
                  </h3>
                  <p className="text-accent font-semibold mb-4">
                    {teamMembers[currentSlide].role}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {teamMembers[currentSlide].bio}
                  </p>
                </div>
              </div>
            </Card>
            <div className="flex justify-center items-center gap-4 mt-8">
              <button onClick={prevSlide} className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors">
                <ArrowLeft size={24} className="text-primary" />
              </button>
              <div className="flex gap-2">
                {teamMembers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide ? 'bg-primary w-8' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <button onClick={nextSlide} className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors">
                <ArrowRight size={24} className="text-primary" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Aligned with Rwanda's Vision 2050</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Working alongside government initiatives to digitize Rwanda's healthcare system
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <h4 className="font-bold text-lg mb-2">Ministry of Health</h4>
              <p className="text-gray-600">Supporting Digital Health Blueprint 2024 implementation</p>
            </Card>
            <Card className="text-center">
              <h4 className="font-bold text-lg mb-2">Rwanda Biomedical Center</h4>
              <p className="text-gray-600">Collaborating on health data standards and protocols</p>
            </Card>
            <Card className="text-center">
              <h4 className="font-bold text-lg mb-2">RISA</h4>
              <p className="text-gray-600">Ensuring data protection and privacy compliance</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden" style={{background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 50%, #1d4ed8 100%)'}}>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Join Us in Transforming Healthcare</h2>
          <p className="text-xl text-blue-100 mb-8">
            Whether you're a patient or a healthcare provider, be part of Rwanda's digital health revolution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white/30 font-semibold">
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/20 font-semibold">
              Contact Our Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}