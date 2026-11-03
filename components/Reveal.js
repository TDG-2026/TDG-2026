'use client';
import { useEffect, useRef, useState } from 'react';

// Content is fully visible without JavaScript. Only elements that start below
// the viewport are hidden and revealed, and nothing animates under reduced motion.
export default function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const ref = useRef(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;
    // Observer geometry avoids synchronous layout reads during hydration.
    let initial = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (initial) {
          initial = false;
          // Never hide content that is already visible on the first observation.
          if (entry.isIntersecting) { io.disconnect(); return; }
          setArmed(true);
        }
        if (entry.isIntersecting) { setVisible(true); io.disconnect(); }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      data-armed={armed ? 'true' : undefined}
      data-visible={visible ? 'true' : undefined}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}