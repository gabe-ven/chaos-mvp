import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

const dsn = import.meta.env.VITE_SENTRY_DSN;

if (!dsn) {
  console.log('[Sentry] Frontend: no VITE_SENTRY_DSN configured - error tracking disabled');
} else {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE || 'development',
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0
  });

  console.log('[Sentry] Frontend initialized');
}

export default Sentry;


