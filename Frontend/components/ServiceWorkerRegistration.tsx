'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[WellSync] Service Worker registered:', registration.scope);
        })
        .catch((error) => {
          console.error('[WellSync] Service Worker registration failed:', error);
        });
    }
  }, []);

  return null;
}
