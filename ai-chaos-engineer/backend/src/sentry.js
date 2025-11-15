/**
 * Sentry integration for error tracking and monitoring
 */

let sentryInitialized = false;
let Sentry = null;

/**
 * Initialize Sentry if DSN is configured
 */
export async function initSentry() {
  const dsn = process.env.SENTRY_DSN;
  
  if (!dsn) {
    console.log('[Sentry] No DSN configured - error tracking disabled');
    return;
  }
  
  try {
    console.log('[Sentry] Initializing with DSN:', dsn.substring(0, 20) + '...');
    
    // Try to import real Sentry package
    try {
      const SentryModule = await import('@sentry/node');
      Sentry = SentryModule;
      
      Sentry.init({
        dsn,
        environment: process.env.NODE_ENV || 'development',
        tracesSampleRate: 1.0,
        // Enable performance monitoring
        integrations: [
          new Sentry.Integrations.Http({ tracing: true }),
        ],
      });
      
      sentryInitialized = true;
      console.log('[Sentry] ✓ Initialized successfully with real Sentry SDK');
    } catch (importError) {
      // Fallback if @sentry/node is not installed
      console.log('[Sentry] ⚠️  @sentry/node not installed, using fallback (run: npm install @sentry/node)');
      sentryInitialized = false;
    }
  } catch (error) {
    console.error('[Sentry] Failed to initialize:', error.message);
  }
}

/**
 * Capture an exception to Sentry
 */
export function captureException(error, context = {}) {
  if (sentryInitialized && Sentry) {
    Sentry.captureException(error, { extra: context });
    console.log('[Sentry] Exception captured:', error.message);
  } else {
    // Fallback: just log to console
    console.error('[Error]', error.message, context);
  }
}

/**
 * Capture a message to Sentry
 */
export function captureMessage(message, level = 'info', context = {}) {
  if (sentryInitialized && Sentry) {
    Sentry.captureMessage(message, { level, extra: context });
    console.log(`[Sentry] Message captured [${level}]:`, message);
  } else {
    console.log(`[${level.toUpperCase()}]`, message, context);
  }
}

/**
 * Add breadcrumb for debugging context
 */
export function addBreadcrumb(message, category = 'default', data = {}) {
  if (sentryInitialized && Sentry) {
    Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: 'info'
    });
  }
  // Always log breadcrumbs for local debugging
  console.log(`[Breadcrumb] ${category}: ${message}`, data);
}

/**
 * Set user context for error tracking
 */
export function setUser(userData) {
  if (sentryInitialized && Sentry) {
    Sentry.setUser(userData);
    console.log('[Sentry] User context set:', userData.id || 'anonymous');
  }
}

/**
 * Middleware for Express to automatically capture errors
 */
export function sentryErrorHandler() {
  return (err, req, res, next) => {
    captureException(err, {
      url: req.url,
      method: req.method,
      body: req.body,
      headers: req.headers
    });
    next(err);
  };
}

/**
 * Middleware for Express request tracking
 */
export function sentryRequestHandler() {
  return (req, res, next) => {
    addBreadcrumb(`${req.method} ${req.url}`, 'http', {
      url: req.url,
      method: req.method
    });
    next();
  };
}

