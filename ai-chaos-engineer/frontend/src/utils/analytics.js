/**
 * Analytics Utilities
 * 
 * Provides analytics tracking functionality.
 * Can be extended to integrate with analytics services like Google Analytics, Mixpanel, etc.
 * 
 * Note: This is a stub implementation. In production, integrate with your analytics service.
 */

/**
 * Track an event
 * Logs events for analytics purposes.
 * 
 * @param {string} eventName - Name of the event
 * @param {Object} properties - Event properties/attributes
 * 
 * @example
 * trackEvent('test_started', { url: 'https://example.com', timestamp: Date.now() });
 */
export function trackEvent(eventName, properties = {}) {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }

  // In production, send to analytics service
  // Example: gtag('event', eventName, properties);
  // Example: mixpanel.track(eventName, properties);
  
  console.log('[Analytics] Event:', eventName, properties);
}

/**
 * Track page view
 * @param {string} pageName - Name of the page
 * @param {Object} properties - Additional properties
 */
export function trackPageView(pageName, properties = {}) {
  trackEvent('page_view', { page: pageName, ...properties });
}

/**
 * Track test started
 * @param {string} url - URL being tested
 */
export function trackTestStarted(url) {
  trackEvent('test_started', { url, timestamp: new Date().toISOString() });
}

/**
 * Track test completed
 * @param {Object} report - Test report
 */
export function trackTestCompleted(report) {
  trackEvent('test_completed', {
    score: report.score,
    status: report.status,
    testsPassed: report.raw?.tests?.filter(t => t.passed).length || 0,
    totalTests: report.raw?.tests?.length || 0,
    duration: report.raw?.totalDuration || 0,
    timestamp: new Date().toISOString()
  });
}

/**
 * Track error
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 */
export function trackError(error, context = {}) {
  trackEvent('error', {
    message: error.message,
    stack: error.stack,
    ...context,
    timestamp: new Date().toISOString()
  });
}

/**
 * Track user action
 * @param {string} action - Action name
 * @param {Object} properties - Action properties
 */
export function trackUserAction(action, properties = {}) {
  trackEvent('user_action', { action, ...properties });
}

