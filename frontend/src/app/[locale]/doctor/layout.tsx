'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Activity, Users, Calendar, FileText, ScanLine } from 'lucide-react';
import AppShell from '@/components/shared/AppShell';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';

  const navItems = [
    { name: 'Dashboard', href: `/${currentLocale}/doctor/dashboard`, icon: Activity },
    { name: 'Scan Patient QR', href: `/${currentLocale}/doctor/scan-qr`, icon: ScanLine },
    { name: 'My Patients', href: `/${currentLocale}/doctor/patients`, icon: Users },
    { name: 'Schedule', href: `/${currentLocale}/doctor/schedule`, icon: Calendar },
    { name: 'Prescriptions', href: `/${currentLocale}/doctor/prescriptions`, icon: FileText },
  ];

  return (
    <AppShell
      portal="Doctor"
      navItems={navItems}
      profileHref={`/${currentLocale}/doctor/profile`}
      displayName={(u) => `Dr. ${u?.last_name || u?.first_name || ''}`.trim()}
    >
      {children}
    </AppShell>
  );
}
