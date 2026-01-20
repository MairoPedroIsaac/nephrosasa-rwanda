/**
 * Footer Component
 * Site footer with links, social media, and copyright
 */

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              <span className="text-primary">Health</span>
              <span className="text-accent">Vault</span> Rwanda
            </h3>
            <p className="text-gray-400 text-sm">
              Your health records, securely connected across all healthcare facilities in Rwanda.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/en/about" className="text-gray-400 hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/en/contact" className="text-gray-400 hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/en/privacy" className="text-gray-400 hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/en/terms" className="text-gray-400 hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Providers */}
          <div>
            <h4 className="text-lg font-semibold mb-4">For Providers</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/en/register/provider" className="text-gray-400 hover:text-accent transition-colors">
                  Register Facility
                </Link>
              </li>
              <li>
                <Link href="/en/features" className="text-gray-400 hover:text-accent transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/en/pricing" className="text-gray-400 hover:text-accent transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin size={18} className="text-accent mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Kigali, Rwanda
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={18} className="text-accent flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  +250 XXX XXX XXX
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={18} className="text-accent flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  info@healthvault.rw
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} HealthVault Rwanda. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;