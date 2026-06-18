'use client';

import React from 'react';
import { Stethoscope, Video, Calendar, Clock } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function ConsultPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Stethoscope className="text-primary" size={32} />
          Consult a Nephrologist
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Schedule a virtual consultation or visit a clinic near you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-xl shadow-primary/5 p-8 border-t-4 border-primary">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <Video size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Virtual Telehealth</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Consult with a certified nephrologist from the comfort of your home via secure video call.
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Clock size={16} className="text-primary" /> 20-30 minute sessions
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Calendar size={16} className="text-primary" /> Available Mon - Sat
            </li>
          </ul>
          <Button variant="primary" fullWidth size="lg">Book Virtual Session</Button>
        </Card>

        <Card className="shadow-xl shadow-primary/5 p-8 border-t-4 border-accent">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
            <Stethoscope size={32} className="text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">In-Person Clinic Visit</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Book an appointment at our partnered NephroSasa clinics across Rwanda.
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Clock size={16} className="text-accent" /> Comprehensive physical exams
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Calendar size={16} className="text-accent" /> Lab work & immediate results
            </li>
          </ul>
          <Button variant="outline" fullWidth size="lg" className="border-accent text-accent hover:bg-accent hover:text-white">Find a Clinic</Button>
        </Card>
      </div>
    </div>
  );
}
