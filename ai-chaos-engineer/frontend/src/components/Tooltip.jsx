import { useState, useRef, useEffect } from 'react';

/**
 * Tooltip Component
 * 
 * Displays helpful tooltip text on hover or focus.
 * Supports multiple positioning options and automatic positioning adjustment.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Element to attach tooltip to
 * @param {string} props.content - Tooltip text content
 * @param {string} props.position - Tooltip position ('top', 'bottom', 'left', 'right')
 * @param {number} props.delay - Delay before showing tooltip in ms (default: 200)
 * @param {boolean} props.disabled - Whether tooltip is disabled
 */
export default function Tooltip({ 
  children, 
  content, 
  position = 'top',
  delay = 200,
  disabled = false
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const timeoutRef = useRef(null);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  /**
   * Adjust tooltip position to keep it in viewport
   */
  useEffect(() => {
    if (!isVisible || !tooltipRef.current || !triggerRef.current) {
      return;
    }

    const tooltip = tooltipRef.current;
    const trigger = triggerRef.current;
    const rect = tooltip.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newPosition = position;

    // Adjust horizontal position if tooltip would overflow
    if (position === 'top' || position === 'bottom') {
      if (rect.left < 0) {
        newPosition = position === 'top' ? 'top-left' : 'bottom-left';
      } else if (rect.right > viewportWidth) {
        newPosition = position === 'top' ? 'top-right' : 'bottom-right';
      }
    }

    // Adjust vertical position if tooltip would overflow
    if (position === 'left' || position === 'right') {
      if (rect.top < 0) {
        newPosition = 'left-top';
      } else if (rect.bottom > viewportHeight) {
        newPosition = 'left-bottom';
      }
    }

    setActualPosition(newPosition);
  }, [isVisible, position]);

  /**
   * Handle mouse enter
   */
  const handleMouseEnter = () => {
    if (disabled) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  /**
   * Handle mouse leave
   */
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  /**
   * Cleanup timeout on unmount
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!content || disabled) {
    return children;
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    'top-left': 'bottom-full right-0 mb-2',
    'top-right': 'bottom-full left-0 mb-2',
    'bottom-left': 'top-full right-0 mt-2',
    'bottom-right': 'top-full left-0 mt-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-neutral-800 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-neutral-800 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-neutral-800 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-neutral-800 border-t-transparent border-b-transparent border-l-transparent'
  };

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 px-3 py-1.5 text-xs text-white bg-neutral-800 rounded-lg shadow-lg whitespace-nowrap ${positionClasses[actualPosition] || positionClasses[position]} animate-fadeIn`}
          role="tooltip"
        >
          {content}
          {/* Arrow */}
          <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position] || arrowClasses.top}`} />
        </div>
      )}
    </div>
  );
}

