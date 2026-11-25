'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, X, Sun, Moon, User, LucideIcon } from 'lucide-react';
import { getCurrentUser, logout } from '@/lib/auth';
import { API_URL } from '@/lib/api';
import { getLang, setLang, Lang, LANGS } from '@/lib/translate';

const getImageUrl = (url: string | null | undefined) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;
  return `${API_URL.replace('/api', '')}${url.startsWith('/') ? '' : '/'}${url}`;
};

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface AppShellProps {
  children: React.ReactNode;
  portal: 'Patient' | 'Doctor';
  navItems: NavItem[];
  profileHref: string;
  displayName: (user: any) => string;
}

/**
 * Shared frame for the patient and doctor portals.
 * Ink navy sidebar, quiet content area, theme and language controls.
 */
export default function AppShell({ children, portal, navItems, profileHref, displayName }: AppShellProps) {
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    const handleUserUpdate = () => setUser(getCurrentUser());
    window.addEventListener('userProfileUpdated', handleUserUpdate);

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
    return () => window.removeEventListener('userProfileUpdated', handleUserUpdate);
  }, []);

  const toggleTheme = () => {
    const next = !isDarkMode;
    document.documentElement.classList.toggle('dark', next);
    localStorage.theme = next ? 'dark' : 'light';
    setIsDarkMode(next);
  };

  const [lang, setLangState] = useState<Lang>('en');
  useEffect(() => setLangState(getLang()), []);
  const switchLanguage = (l: Lang) => {
    if (l === lang) return;
    setLangState(l);
    setLang(l);
  };

  const isActive = (href: string) => {
    const strip = (p: string) => p.replace(/^\/(en|rw|fr)/, '');
    return strip(pathname) === strip(href);
  };

  const initial = (user?.first_name?.charAt(0) || portal.charAt(0)).toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-ink transition-colors duration-200">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-16 z-30 flex items-center justify-between px-4 bg-white/90 dark:bg-ink/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-2">
          <button onClick={() => setOpen(!open)} aria-label="Open menu" className="p-2 -ml-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span translate="no" className="notranslate font-display text-lg font-bold text-gray-900 dark:text-white">NephroSasa Rwanda</span>
        </div>
        <button onClick={toggleTheme} aria-label="Toggle dark mode" className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10">
          {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[264px] bg-ink text-gray-300 border-r border-white/5 transform transition-transform duration-300 ease-out lg:relative lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-full flex flex-col pt-20 lg:pt-7 pb-5">
          <div className="px-6 flex items-center justify-between">
            <Link href={`/en/${portal === 'Doctor' ? 'doctor' : 'patient'}/dashboard`} className="flex items-center gap-2.5">
              <span className="relative h-8 w-8">
                <Image src="/nephrosasa-icon.png" alt="" fill sizes="32px" className="object-contain" />
              </span>
              <span>
                <span translate="no" className="notranslate block font-display text-[17px] font-bold leading-none text-white">NephroSasa Rwanda</span>
                <span className="block mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-gray-500">{portal} portal</span>
              </span>
            </Link>
            <button onClick={toggleTheme} aria-label="Toggle dark mode" className="hidden lg:grid h-9 w-9 place-items-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
              {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>

          <p className="px-6 mt-9 mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-gray-500">Menu</p>
          <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors ${
                    active ? 'bg-white/[0.07] text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <item.icon size={18} className={active ? 'text-primary-light' : 'text-gray-500 group-hover:text-gray-300'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="px-3 mt-4 space-y-3">
            <div className="mx-3 flex rounded-full bg-white/5 p-1 w-max">
              {LANGS.map((l) => (
                <button
                  key={l}
                  onClick={() => switchLanguage(l)}
                  className={`px-3.5 py-1 rounded-full font-mono text-[11px] uppercase transition-colors ${lang === l ? 'bg-white text-ink' : 'text-gray-400 hover:text-white'}`}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 p-3">
              <Link href={profileHref} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl p-1 hover:bg-white/5 transition-colors">
                <span className="relative grid h-10 w-10 flex-shrink-0 place-items-center overflow-hidden rounded-full bg-primary text-white font-semibold">
                  {user?.profile_picture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={getImageUrl(user.profile_picture)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    initial
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-white">{displayName(user)}</span>
                  <span className="block truncate text-xs text-gray-500">{user?.email}</span>
                </span>
                <User size={16} className="ml-auto text-gray-500 flex-shrink-0" />
              </Link>
              <button onClick={() => logout()} className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl py-2 text-sm text-gray-400 hover:text-white hover:bg-red-500/15 transition-colors">
                <LogOut size={15} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-ink/60 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />}

      <main className="flex-1 w-full overflow-y-auto pt-16 lg:pt-0">
        <div className="min-h-full">{children}</div>
      </main>
    </div>
  );
}
