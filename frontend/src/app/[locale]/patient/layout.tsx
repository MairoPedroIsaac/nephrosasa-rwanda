'use client';

import React from 'react';
import { Activity, Clock, HeartPulse, Stethoscope, CreditCard, QrCode } from 'lucide-react';
import AppShell from '@/components/shared/AppShell';

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: 'Dashboard', href: '/en/patient/dashboard', icon: Activity },
    { name: 'Log Vitals', href: '/en/patient/log-vitals', icon: HeartPulse },
    { name: 'Health History', href: '/en/patient/records', icon: Clock },
    { name: 'Share Record', href: '/en/patient/share-record', icon: QrCode },
    { name: 'Consultancy', href: '/en/patient/consult', icon: Stethoscope },
    { name: 'Payments', href: '/en/patient/payments', icon: CreditCard },
  ];

  return (
    <AppShell
      portal="Patient"
      navItems={navItems}
      profileHref="/en/patient/profile"
      displayName={(u) => `${u?.first_name ?? ''} ${u?.last_name ?? ''}`.trim()}
    >
      {children}
    </AppShell>
  );
}
