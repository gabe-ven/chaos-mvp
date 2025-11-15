/**
 * Clipboard Utilities
 * 
 * Functions for copying text to clipboard with fallback support
 * Used for copying test results, URLs, and other data
 */

/**
 * Copies text to clipboard using the modern Clipboard API with fallback
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export async function copyToClipboard(text) {
  if (!text || typeof text !== 'string') {
    return false;
  }

  // Try modern Clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('[Clipboard] Clipboard API failed:', error);
      // Fall through to fallback method
    }
  }

  // Fallback: Create temporary textarea element
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);

    return successful;
  } catch (error) {
    console.error('[Clipboard] Fallback method failed:', error);
    return false;
  }
}

/**
 * Copies JSON object to clipboard as formatted string
 * @param {Object} obj - Object to copy
 * @param {number} indent - JSON indentation (default: 2)
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export async function copyJsonToClipboard(obj, indent = 2) {
  try {
    const jsonString = JSON.stringify(obj, null, indent);
    return await copyToClipboard(jsonString);
  } catch (error) {
    console.error('[Clipboard] Failed to stringify object:', error);
    return false;
  }
}

/**
 * Checks if clipboard API is available
 * @returns {boolean} - True if clipboard is available
 */
export function isClipboardAvailable() {
  return !!(navigator.clipboard && navigator.clipboard.writeText);
}

