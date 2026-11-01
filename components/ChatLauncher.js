'use client';

import dynamic from 'next/dynamic';
import {useEffect, useState} from 'react';

// Genie widget loads automatically once the page is idle (keeps LCP/INP clean),
// or immediately on the visitor's first tap/keypress. GenieChat then shows its own
// light-blue smoky launcher, the "Ask Genie / Book a live demo" pill and the demo reminders.
const Chat = dynamic(() => import('./GenieChat'), {ssr: false, loading: () => null});

export default function ChatLauncher(props) {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const go = () => setLoad(true);
    const useIdle = typeof window.requestIdleCallback === 'function';
    const handle = useIdle ? window.requestIdleCallback(go, {timeout: 2000}) : setTimeout(go, 800);
    window.addEventListener('pointerdown', go, {once: true, passive: true});
    window.addEventListener('keydown', go, {once: true});
    return () => {
      if (useIdle) window.cancelIdleCallback(handle); else clearTimeout(handle);
      window.removeEventListener('pointerdown', go);
      window.removeEventListener('keydown', go);
    };
  }, []);

  return load ? <Chat {...props} /> : null;
}