/**
 * Navbar Component
 * Top navigation with logo, links, language switcher, and auth buttons
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, Globe, Moon, Sun } from 'lucide-react';
import { getCurrentUser, logout, isAuthenticated } from '@/lib/auth';
import Button from '../ui/Button';
import { getLang, setLang, Lang } from '@/lib/translate';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme
  useEffect(() => {
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

  const [userType, setUserType] = useState<string | null>(null);

  // Check authentication status on component mount
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    const user = getCurrentUser();
    if (user) {
      setUserType(user.user_type);
    }
    
    setCurrentLocale(getLang());
    
  }, [pathname]);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  // Language switcher: applies to the whole platform and is remembered
  const switchLanguage = (locale: string) => {
    if (locale === currentLocale) return;
    setCurrentLocale(locale);
    setLang(locale as Lang);
  };

  // Navigation links
  const navLinks = [
    { href: `/en`, label: 'Home' },
    { href: `/en/about`, label: 'About' },
    { href: `/en/contact`, label: 'Contact' },
    { href: `/en/privacy-policy`, label: 'Privacy Policy' },
  ];

  if (pathname.includes('/patient/') || pathname.includes('/doctor/') || pathname.includes('/admin/') || pathname.includes('/shared-record/')) {
    return null;
  }

  // Solid bar everywhere; kept as a flag in case a dark page header needs it later
  const onDark = false;
  const linkTone = onDark ? 'text-white/70 hover:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white';

  return (
    <nav className={`sticky top-0 z-50 transition-colors duration-300 ${onDark ? 'bg-ink text-white' : 'bg-white/85 dark:bg-ink/85 backdrop-blur-xl border-b border-gray-200/70 dark:border-white/10'}`}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">
          {/* Logo - Theme Aware */}
          <Link href={isLoggedIn ? `/en/${userType === 'DOCTOR' ? 'doctor' : 'patient'}/dashboard` : '/en'} className="flex items-center gap-2 md:gap-3">
            <div className="h-9 w-9 md:h-10 md:w-10 relative flex-shrink-0">
              <Image
                src="/nephrosasa-icon.png"
                alt="NephroSasa Rwanda Logo Icon"
                fill
                className="object-contain"
                sizes="48px"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span translate="no" className={`notranslate font-display text-lg md:text-xl font-bold leading-tight tracking-tight ${onDark ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                NephroSasa Rwanda
              </span>
              <span className={`text-xs font-medium hidden sm:block ${onDark ? 'text-white/60' : 'text-gray-500 dark:text-gray-400'}`}>
                Monitor Your Kidneys. Before It&apos;s Too Late.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Nav Links (Hidden on Dashboard) */}
            {!pathname.includes('/dashboard') && navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[15px] transition-colors duration-200 ${linkTone} ${
                  pathname === link.href ? (onDark ? '!text-white font-semibold' : '!text-gray-900 dark:!text-white font-semibold') : ''
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Custom Language Switcher */}
            <div className="relative group">
              <button className={`flex items-center space-x-1 text-[15px] ${linkTone}`}>
                <Globe size={20} />
                <span className="uppercase">{currentLocale}</span>
              </button>
              
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden border border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => switchLanguage('en')}
                  className="flex items-center space-x-3 w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <img src="https://flagcdn.com/w20/gb.png" srcSet="https://flagcdn.com/w40/gb.png 2x" width="20" alt="English Flag" className="rounded-sm shadow-sm" />
                  <span className="font-medium text-sm">English</span>
                </button>
                <button
                  onClick={() => switchLanguage('rw')}
                  className="flex items-center space-x-3 w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <img src="https://flagcdn.com/w20/rw.png" srcSet="https://flagcdn.com/w40/rw.png 2x" width="20" alt="Rwanda Flag" className="rounded-sm shadow-sm" />
                  <span className="font-medium text-sm">Kinyarwanda</span>
                </button>
                <button
                  onClick={() => switchLanguage('fr')}
                  className="flex items-center space-x-3 w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t-0"
                >
                  <img src="https://flagcdn.com/w20/fr.png" srcSet="https://flagcdn.com/w40/fr.png 2x" width="20" alt="France Flag" className="rounded-sm shadow-sm" />
                  <span className="font-medium text-sm">Français</span>
                </button>
              </div>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${onDark ? 'text-white/80 hover:bg-white/10' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Auth Buttons */}
            {isLoggedIn && (
              <div className="flex items-center space-x-4">
                {!pathname.includes('/dashboard') && (
                  <Link href={`/en/${userType === 'DOCTOR' ? 'doctor' : 'patient'}/dashboard`}>
                    <Button variant="outline" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Button variant="primary" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            )}
            {!isLoggedIn && (
              <div className="flex items-center space-x-4">
                <Link href={`/en/login`}>
                  <Button variant="outline" size="sm" className={onDark ? '!border-white/30 !text-white hover:!border-white' : ''}>
                    Login
                  </Button>
                </Link>
                <Link href={`/en/register`}>
                  <Button variant={onDark ? 'outline' : 'secondary'} size="sm" className={onDark ? '!bg-white !text-ink !border-white' : ''}>
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 md:hidden">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${onDark ? 'text-white/80 hover:bg-white/10' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              aria-label="Open menu"
              className={`p-2 rounded-full transition-colors ${onDark ? 'text-white hover:bg-white/10' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
            {!pathname.includes('/dashboard') && (
              <div className="flex flex-col space-y-3 px-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-700 dark:text-gray-200 font-medium px-2 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Mobile Language Switcher */}
            <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Language</p>
              <div className="flex space-x-2">
                <button onClick={() => { switchLanguage('en'); setIsMenuOpen(false); }} className={`px-3 py-1.5 text-sm rounded-full border flex items-center gap-2 ${currentLocale === 'en' ? 'bg-primary text-white border-primary' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`}>
                  <img src="https://flagcdn.com/w20/gb.png" srcSet="https://flagcdn.com/w40/gb.png 2x" width="16" alt="EN" className="rounded-sm" /> EN
                </button>
                <button onClick={() => { switchLanguage('rw'); setIsMenuOpen(false); }} className={`px-3 py-1.5 text-sm rounded-full border flex items-center gap-2 ${currentLocale === 'rw' ? 'bg-primary text-white border-primary' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`}>
                  <img src="https://flagcdn.com/w20/rw.png" srcSet="https://flagcdn.com/w40/rw.png 2x" width="16" alt="RW" className="rounded-sm" /> RW
                </button>
                <button onClick={() => { switchLanguage('fr'); setIsMenuOpen(false); }} className={`px-3 py-1.5 text-sm rounded-full border flex items-center gap-2 ${currentLocale === 'fr' ? 'bg-primary text-white border-primary' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`}>
                  <img src="https://flagcdn.com/w20/fr.png" srcSet="https://flagcdn.com/w40/fr.png 2x" width="16" alt="FR" className="rounded-sm" /> FR
                </button>
              </div>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 flex flex-col space-y-3">
              {isLoggedIn ? (
                <>
                  {!pathname.includes('/dashboard') && (
                    <Link href={`/en/${userType === 'DOCTOR' ? 'doctor' : 'patient'}/dashboard`} onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" fullWidth>
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <Button variant="primary" fullWidth onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href={`/en/login`} onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" fullWidth>
                      Login
                    </Button>
                  </Link>
                  <Link href={`/en/register`} onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" fullWidth>
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;