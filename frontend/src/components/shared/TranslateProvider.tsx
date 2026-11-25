'use client';

import { useEffect } from 'react';

// Google Translate rewrites text nodes, which can make React's own DOM
// updates fail. These guards let React carry on when a node has moved.
if (typeof window !== 'undefined' && typeof Node !== 'undefined' && Node.prototype && !(window as any).__gtPatched) {
  (window as any).__gtPatched = true;
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (this: Node, child: any) {
    if (child.parentNode !== this) return child;
    return originalRemoveChild.apply(this, arguments as any);
  } as any;
  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (this: Node, newNode: any, referenceNode: any) {
    if (referenceNode && referenceNode.parentNode !== this) return newNode;
    return originalInsertBefore.apply(this, arguments as any);
  } as any;
}

/**
 * Loads the Google Translate widget once for the whole app, so the language
 * chosen on the home page carries into every dashboard screen.
 */
export default function TranslateProvider() {
  useEffect(() => {
    if (document.getElementById('google-translate-script')) return;
    (window as any).googleTranslateElementInit = () => {
      const g = (window as any).google;
      if (g?.translate) {
        new g.translate.TranslateElement(
          { pageLanguage: 'en', includedLanguages: 'en,rw,fr', autoDisplay: false },
          'google_translate_element'
        );
      }
    };
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return <div id="google_translate_element" className="hidden" aria-hidden="true" />;
}
