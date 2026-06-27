'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, logout } from '@/lib/auth';
import { 
  Activity, 
  User, 
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Stethoscope,
  Users,
  Calendar,
  FileText
} from 'lucide-react';

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = pathname.split('/')[1] || 'en';
  
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    
    // Check initial theme
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const switchLanguage = (lang: string) => {
    const segments = pathname.split('/');
    segments[1] = lang;
    router.push(segments.join('/'));
    
    // Trigger Google Translate widget to translate dynamically
    const gtLocaleMap: Record<string, string> = {
      'en': 'en',
      'rw': 'rw',
      'fr': 'fr'
    };
    
    const targetLang = gtLocaleMap[lang];
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = targetLang;
      selectElement.dispatchEvent(new Event('change'));
    }
  };

  const navItems = [
    { name: 'Dashboard', href: `/${currentLocale}/doctor/dashboard`, icon: Activity },
    { name: 'My Patients', href: `/${currentLocale}/doctor/patients`, icon: Users },
    { name: 'Schedule', href: `/${currentLocale}/doctor/schedule`, icon: Calendar },
    { name: 'Prescriptions', href: `/${currentLocale}/doctor/prescriptions`, icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-200">
      {/* Mobile Header / Sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-sm z-30 flex items-center justify-between px-4 transition-colors">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 dark:text-gray-300"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="font-bold text-gray-900 dark:text-white">NephroSasa</span>
        </div>
        <button 
          onClick={toggleTheme}
          className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-primary via-primary-dark to-primary transform transition-transform duration-300 ease-in-out shadow-2xl
        lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col pt-20 lg:pt-8 pb-4 overflow-hidden">
          <div className="px-6 mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">NephroSasa</h2>
              <p className="text-blue-200 text-sm flex items-center gap-1"><Stethoscope size={14}/> Doctor Portal</p>
            </div>
            {/* Desktop Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="hidden lg:flex p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div className="px-4 mb-6">
            <div className="flex bg-white/10 rounded-full p-1 border border-white/20 w-max">
              <button onClick={() => switchLanguage('en')} className={`px-4 py-1 text-xs rounded-full transition-colors ${currentLocale === 'en' ? 'bg-white text-primary font-bold shadow-sm' : 'text-white hover:bg-white/20'}`}>EN</button>
              <button onClick={() => switchLanguage('rw')} className={`px-4 py-1 text-xs rounded-full transition-colors ${currentLocale === 'rw' ? 'bg-white text-primary font-bold shadow-sm' : 'text-white hover:bg-white/20'}`}>RW</button>
              <button onClick={() => switchLanguage('fr')} className={`px-4 py-1 text-xs rounded-full transition-colors ${currentLocale === 'fr' ? 'bg-white text-primary font-bold shadow-sm' : 'text-white hover:bg-white/20'}`}>FR</button>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href.includes('#') && pathname === item.href.split('#')[0]);
              return (
                <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
                    isActive 
                      ? 'bg-white/20 text-white font-semibold shadow-inner border border-white/10' 
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}>
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="px-4 mt-auto">
            <Link href={`/${currentLocale}/doctor/profile`} onClick={() => setIsMobileMenuOpen(false)}>
              <div className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-xl transition-colors duration-200 ${
                pathname === `/${currentLocale}/doctor/profile` 
                  ? 'bg-white/20 text-white font-semibold shadow-inner border border-white/10' 
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}>
                <User size={20} />
                <span>Profile</span>
              </div>
            </Link>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {user?.first_name?.charAt(0) || 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-white font-medium truncate">Dr. {user?.last_name || user?.first_name}</p>
                  <p className="text-blue-200 text-xs truncate">{user?.email}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-red-200 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full pt-16 lg:pt-0 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
