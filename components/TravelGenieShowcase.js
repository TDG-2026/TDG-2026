'use client';

import { useEffect, useRef, useState } from 'react';

export default function TravelGenieShowcase() {
  const frame = useRef(null);
  const [height, setHeight] = useState(900);

  useEffect(() => {
    function handleMessage(event) {
      if (
        event.origin !== window.location.origin ||
        event.source !== frame.current?.contentWindow
      ) {
        return;
      }

      const data = event.data;

      if (
        data?.type === 'travel-genie:height' &&
        Number.isFinite(data.height)
      ) {
        setHeight(Math.ceil(Math.max(200, Math.min(6000, data.height))));
      }
    }

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <iframe
      ref={frame}
      src="/genie-showcase/index.html"
      title="Explore Travel Genie tools"
      loading="lazy"
      style={{
        display: 'block',
        width: '100%',
        height,
        border: 0,
        background: '#0b1028',
      }}
    />
  );
}