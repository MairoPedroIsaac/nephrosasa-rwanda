/**
 * Navbar Component
 * Top navigation with logo, links, language switcher, and auth buttons
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, Globe } from 'lucide-react';
import { getCurrentUser, logout, isAuthenticated } from '@/lib/auth';
import Button from '../ui/Button';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('en');

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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - JUST THE IMAGE */}
          <Link href={`/${currentLocale}`} className="flex items-center">
            <div className="h-14 w-52 md:h-16 md:w-64 relative">
              <Image
                src="/healthvault-logo.svg"
                alt="HealthVault Rwanda Logo"
                fill
                className="object-contain object-left"
                sizes="(max-width: 768px) 128px, 160px"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Nav Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-gray-700 hover:text-primary transition-colors duration-200 ${
                  pathname === link.href ? 'text-primary font-semibold' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Language Switcher */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-primary">
                <Globe size={20} />
                <span className="uppercase">{currentLocale}</span>
              </button>
              
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button
                  onClick={() => switchLanguage('en')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-700 hover:text-primary"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
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