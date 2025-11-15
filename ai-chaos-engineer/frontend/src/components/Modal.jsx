import { useEffect, useRef } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';

/**
 * Modal Component
 * 
 * Reusable modal/dialog component with backdrop, animations, and accessibility features.
 * Supports keyboard navigation (Escape to close) and click-outside-to-close.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback to close modal
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.size - Modal size ('sm', 'md', 'lg', 'xl', 'full')
 * @param {boolean} props.showCloseButton - Whether to show close button (default: true)
 * @param {boolean} props.closeOnBackdropClick - Whether to close on backdrop click (default: true)
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true
}) {
  /**
   * Modal content ref for click-outside detection
   */
  const modalRef = useClickOutside(
    closeOnBackdropClick ? onClose : () => {},
    [isOpen, closeOnBackdropClick]
  );

  /**
   * Handle Escape key to close modal
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape' && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scaleIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className={`relative bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-neutral-800">
            <h2 id="modal-title" className="text-lg font-semibold text-white">
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-neutral-800"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

