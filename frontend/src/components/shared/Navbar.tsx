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

  // Check authentication status on component mount
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    
    // Get current locale from pathname
    const locale = pathname.split('/')[1];
    if (['en', 'rw', 'fr'].includes(locale)) {
      setCurrentLocale(locale);
    }
  }, [pathname]);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  // Language switcher
  const switchLanguage = (locale: string) => {
    const newPathname = pathname.replace(/^\/(en|rw|fr)/, `/${locale}`);
    router.push(newPathname);
    setCurrentLocale(locale);
  };

  // Navigation links
  const navLinks = [
    { href: `/${currentLocale}`, label: 'Home' },
    { href: `/${currentLocale}/about`, label: 'About' },
    { href: `/${currentLocale}/contact`, label: 'Contact' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Theme Aware */}
          <Link href={`/${currentLocale}`} className="flex items-center gap-2 md:gap-3">
            <div className="h-10 w-10 md:h-12 md:w-12 relative flex-shrink-0">
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
              <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                NephroSasa Rwanda
              </span>
              <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                Monitor Your Kidneys. Before It's Too Late.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Nav Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors duration-200 ${
                  pathname === link.href ? 'text-primary dark:text-primary font-semibold' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Language Switcher */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary">
                <Globe size={20} />
                <span className="uppercase">{currentLocale}</span>
              </button>
              
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button
                  onClick={() => switchLanguage('en')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                >
                  English
                </button>
                <button
                  onClick={() => switchLanguage('rw')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Kinyarwanda
                </button>
                <button
                  onClick={() => switchLanguage('fr')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg"
                >
                  Français
                </button>
              </div>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link href={`/${currentLocale}/dashboard`}>
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="primary" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href={`/${currentLocale}/login`}>
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href={`/${currentLocale}/register`}>
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 md:hidden">
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-700 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Language Switcher */}
            <div className="py-2 border-t border-gray-200 mt-2">
              <p className="text-sm text-gray-600 mb-2">Language</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => switchLanguage('en')}
                  className={`px-3 py-1 rounded ${
                    currentLocale === 'en' ? 'bg-primary text-white' : 'bg-gray-200'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => switchLanguage('rw')}
                  className={`px-3 py-1 rounded ${
                    currentLocale === 'rw' ? 'bg-primary text-white' : 'bg-gray-200'
                  }`}
                >
                  RW
                </button>
                <button
                  onClick={() => switchLanguage('fr')}
                  className={`px-3 py-1 rounded ${
                    currentLocale === 'fr' ? 'bg-primary text-white' : 'bg-gray-200'
                  }`}
                >
                  FR
                </button>
              </div>
            </div>

            {/* Mobile Auth Buttons */}
            {isLoggedIn ? (
              <div className="mt-4 space-y-2">
                <Link href={`/${currentLocale}/dashboard`}>
                  <Button variant="outline" size="sm" fullWidth>
                    Dashboard
                  </Button>
                </Link>
                <Button variant="primary" size="sm" fullWidth onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <Link href={`/${currentLocale}/login`}>
                  <Button variant="outline" size="sm" fullWidth>
                    Login
                  </Button>
                </Link>
                <Link href={`/${currentLocale}/register`}>
                  <Button variant="primary" size="sm" fullWidth>
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;