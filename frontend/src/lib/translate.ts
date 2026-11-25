/**
 * Site-wide language switching through the Google Translate widget.
 *
 * Google Translate reads the `googtrans` cookie on page load and translates
 * the whole page, then keeps translating new content as React renders it.
 * Setting the cookie and reloading is the reliable way to switch: it works on
 * every page (public site and dashboards) and survives navigation.
 */
export type Lang = 'en' | 'rw' | 'fr';
export const LANGS: Lang[] = ['en', 'rw', 'fr'];

const COOKIE = 'googtrans';

const domains = () => {
  const host = window.location.hostname;
  const list = ['', host];
  if (host.split('.').length > 1 && host !== 'localhost') list.push('.' + host);
  return list;
};

export const getLang = (): Lang => {
  if (typeof document === 'undefined') return 'en';
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  const value = match ? decodeURIComponent(match[1]) : '';
  const lang = value.split('/').pop() as Lang;
  return LANGS.includes(lang) ? lang : 'en';
};

export const setLang = (lang: Lang) => {
  if (typeof document === 'undefined') return;
  const expired = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
  // Clear every variant first so an old value cannot win
  for (const d of domains()) {
    document.cookie = `${COOKIE}=; ${expired}; path=/${d ? `; domain=${d}` : ''}`;
  }
  if (lang !== 'en') {
    for (const d of domains()) {
      document.cookie = `${COOKIE}=/en/${lang}; path=/; max-age=31536000${d ? `; domain=${d}` : ''}`;
    }
  }
  try {
    localStorage.setItem('lang', lang);
  } catch {}
  window.location.reload();
};
