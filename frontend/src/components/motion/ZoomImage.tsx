'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

/**
 * Photo that eases from a slight zoom to its natural size as it scrolls
 * through the viewport. Calm, no bounce. Turns off for reduced motion.
 */
interface ZoomImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  from?: number;
}

export default function ZoomImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  sizes = '(max-width: 1024px) 100vw, 60vw',
  priority = false,
  from = 1.05,
}: ZoomImageProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = wrap.current;
      const target = inner.current;
      if (!el || !target) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
      target.style.transform = `scale(${from - (from - 1) * p})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [from]);

  return (
    <div ref={wrap} className={`${/\b(absolute|fixed)\b/.test(className) ? '' : 'relative '}overflow-hidden ${className}`}>
      <div ref={inner} className="absolute inset-0 will-change-transform" style={{ transform: `scale(${from})` }}>
        <Image src={src} alt={alt} fill sizes={sizes} quality={90} priority={priority} className={`object-cover ${imgClassName}`} />
      </div>
    </div>
  );
}
