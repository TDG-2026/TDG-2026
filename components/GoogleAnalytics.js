'use client';

import {useEffect} from 'react';

const GA_ID = 'G-BWVQEP3TGT';
const CONSENT_KEY = 'tg-consent-v1';
const SCRIPT_ID = 'tdg-google-analytics';
const MAX_AGE = 180 * 86400000;

function analyticsAllowed(consent) {
  const age = Date.now() - consent?.updatedAt;

  return (
    consent?.version === 1 &&
    consent.analytics === true &&
    Number.isFinite(age) &&
    age >= 0 &&
    age < MAX_AGE
  );
}

function readConsent() {
  try {
    return JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
  } catch {
    return null;
  }
}

export default function GoogleAnalytics() {
  useEffect(() => {
    function applyConsent(consent) {
      const allowed = analyticsAllowed(consent);

      // Stop Analytics collection when consent is withdrawn.
      window[`ga-disable-${GA_ID}`] = !allowed;

      if (!allowed) {
        window.gtag?.('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
        return;
      }

      window.dataLayer = window.dataLayer || [];

      if (!window.gtag) {
        window.gtag = function () {
          window.dataLayer.push(arguments);
        };

        window.gtag('consent', 'default', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
      }

      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });

      // Initialize only once per document.
      if (document.getElementById(SCRIPT_ID)) return;

      window.gtag('js', new Date());
      window.gtag('config', GA_ID, {
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });

      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.async = true;
      script.src =
        `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);
    }

    function onConsent(event) {
      applyConsent(event.detail);
    }

    function onStorage(event) {
      if (event.key === CONSENT_KEY || event.key === null) {
        applyConsent(readConsent());
      }
    }

    window.addEventListener('tg:consent', onConsent);
    window.addEventListener('storage', onStorage);
    applyConsent(readConsent());

    return () => {
      window.removeEventListener('tg:consent', onConsent);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return null;
}