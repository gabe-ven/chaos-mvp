import React from 'react';

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing
 * the entire application.
 * 
 * This is a class component because React Error Boundaries must be
 * class components (hooks cannot be used for error boundaries).
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  /**
   * Called when an error is thrown during rendering
   * Updates state so the next render will show the fallback UI
   */
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  /**
   * Called after an error has been thrown by a descendant component
   * Logs error information for debugging
   */
  componentDidCatch(error, errorInfo) {
    // Log error to console for debugging
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo
    });

    // Here you could also log the error to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  /**
   * Handles the retry action
   * Resets error state to allow the app to try rendering again
   */
  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  /**
   * Handles the reload action
   * Reloads the entire page
   */
  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
          <div className="max-w-2xl w-full space-y-6">
            {/* Error Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">
                Something went wrong
              </h1>
              <p className="text-neutral-400">
                An unexpected error occurred. Don't worry, your data is safe.
              </p>
            </div>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 space-y-2">
                <h3 className="text-sm font-semibold text-red-400">
                  Error Details (Development Only)
                </h3>
                <pre className="text-xs text-neutral-400 overflow-x-auto font-mono">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-xs text-neutral-500 cursor-pointer hover:text-neutral-400">
                      Stack Trace
                    </summary>
                    <pre className="text-xs text-neutral-500 overflow-x-auto font-mono mt-2">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-6 py-3 bg-white hover:bg-neutral-100 text-black font-semibold rounded-xl transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-xl transition-colors border border-neutral-700"
              >
                Reload Page
              </button>
            </div>

            {/* Help Text */}
            <div className="text-center text-sm text-neutral-500">
              <p>
                If this problem persists, please{' '}
                <a
                  href="https://github.com/your-repo/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  report an issue
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Render children normally if no error
    return this.props.children;
  }
}

export default ErrorBoundary;

