/**
 * Color Utilities
 * 
 * Functions for color manipulation, conversion, and generation.
 * Useful for dynamic theming and color calculations.
 */

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color string (e.g., '#FF5733' or 'FF5733')
 * @returns {{r: number, g: number, b: number}|null} - RGB object or null if invalid
 */
export function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') {
    return null;
  }

  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Validate hex format
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    return null;
  }

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return { r, g, b };
}

/**
 * Convert RGB to hex color
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} - Hex color string
 */
export function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Calculate luminance of a color
 * Used for determining text color contrast
 * @param {string} hex - Hex color string
 * @returns {number} - Luminance value (0-1)
 */
export function getLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return 0.5; // Default to medium luminance
  }

  // Normalize RGB values to 0-1
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  // Calculate relative luminance
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Get contrast ratio between two colors
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color
 * @returns {number} - Contrast ratio (1-21)
 */
export function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Determine if text color should be light or dark based on background
 * @param {string} backgroundColor - Background hex color
 * @returns {'light'|'dark'} - Recommended text color
 */
export function getTextColor(backgroundColor) {
  const luminance = getLuminance(backgroundColor);
  return luminance > 0.5 ? 'dark' : 'light';
}

/**
 * Lighten a color by a percentage
 * @param {string} hex - Hex color string
 * @param {number} percent - Lighten percentage (0-100)
 * @returns {string} - Lightened hex color
 */
export function lighten(hex, percent) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return hex;
  }

  const factor = percent / 100;
  const r = Math.min(255, rgb.r + (255 - rgb.r) * factor);
  const g = Math.min(255, rgb.g + (255 - rgb.g) * factor);
  const b = Math.min(255, rgb.b + (255 - rgb.b) * factor);

  return rgbToHex(r, g, b);
}

/**
 * Darken a color by a percentage
 * @param {string} hex - Hex color string
 * @param {number} percent - Darken percentage (0-100)
 * @returns {string} - Darkened hex color
 */
export function darken(hex, percent) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return hex;
  }

  const factor = percent / 100;
  const r = Math.max(0, rgb.r * (1 - factor));
  const g = Math.max(0, rgb.g * (1 - factor));
  const b = Math.max(0, rgb.b * (1 - factor));

  return rgbToHex(r, g, b);
}

/**
 * Add opacity to a hex color
 * @param {string} hex - Hex color string
 * @param {number} opacity - Opacity value (0-1)
 * @returns {string} - RGBA color string
 */
export function addOpacity(hex, opacity) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return `rgba(0, 0, 0, ${opacity})`;
  }

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

