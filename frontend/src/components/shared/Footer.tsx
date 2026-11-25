/**
 * Footer Component
 * Site footer with links, social media, and copyright
 */
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const pathname = usePathname();

  if (pathname.includes('/patient') || pathname.includes('/doctor') || pathname.includes('/shared-record')) {
    return null;
  }

  return (
    <footer className="bg-ink text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 translate="no" className="notranslate font-display text-2xl font-bold tracking-tight mb-3">
              NephroSasa Rwanda<span className="text-primary-light">.</span>
            </h3>
            <p className="text-gray-400 text-sm max-w-[16rem]">
              Monitor Your Kidneys. Before It's Too Late.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/en/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/en/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/en/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Get Started */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-4">Get Started</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/en/register/patient" className="text-gray-400 hover:text-white transition-colors">
                  Register as Patient
                </Link>
              </li>
              <li>
                <Link href="/en/register/doctor" className="text-gray-400 hover:text-white transition-colors">
                  Register as Doctor
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin size={18} className="text-primary-light mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Kigali, Rwanda
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={18} className="text-primary-light flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  +250 XXX XXX XXX
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={18} className="text-primary-light flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  info@nephrosasa.rw
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between gap-2">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} NephroSasa Rwanda. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">Kigali, Rwanda</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;