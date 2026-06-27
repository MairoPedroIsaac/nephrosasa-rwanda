'use client';

import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import Card from '@/components/ui/Card';

export default function DoctorSchedulePage() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Create 24 empty cells for a 4-week grid
  const cells = Array.from({ length: 24 });

  return (
    <div className="min-h-full pb-12 bg-gray-50 dark:bg-gray-900 transition-colors p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            My Schedule
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Upcoming consultations and appointments.
          </p>
        </div>

        <Card className="shadow-xl shadow-primary/5 p-8 mb-8 text-center border-t-4 border-primary">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarIcon size={32} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No appointments scheduled yet.
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Appointments will appear here once patients book consultations with you.
          </p>
        </Card>

        {/* Placeholder Calendar Visual */}
        <Card className="shadow-xl shadow-primary/5 p-6 bg-white dark:bg-gray-800">
          <div className="grid grid-cols-6 gap-2 sm:gap-4 text-center mb-4">
            {days.map(day => (
              <div key={day} className="font-bold text-gray-500 dark:text-gray-400 text-sm py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-2 sm:gap-4">
            {cells.map((_, i) => (
              <div 
                key={i} 
                className="aspect-square bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-lg p-2 opacity-50 flex items-start justify-end"
              >
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
