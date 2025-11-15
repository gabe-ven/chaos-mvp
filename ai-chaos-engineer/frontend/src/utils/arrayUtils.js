/**
 * Array Utilities
 * 
 * Common array manipulation and transformation functions.
 * Provides reusable array operations with proper error handling.
 */

/**
 * Chunk array into smaller arrays of specified size
 * @param {Array} array - Array to chunk
 * @param {number} size - Chunk size
 * @returns {Array} - Array of chunks
 * 
 * @example
 * chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
 */
export function chunk(array, size = 1) {
  if (!Array.isArray(array)) {
    return [];
  }

  if (size <= 0) {
    return [array];
  }

  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  return chunks;
}

/**
 * Remove duplicates from array
 * @param {Array} array - Array to deduplicate
 * @param {Function} keyFn - Optional function to extract comparison key
 * @returns {Array} - Array with duplicates removed
 * 
 * @example
 * unique([1, 2, 2, 3]); // [1, 2, 3]
 * unique([{id: 1}, {id: 2}, {id: 1}], item => item.id); // [{id: 1}, {id: 2}]
 */
export function unique(array, keyFn = null) {
  if (!Array.isArray(array)) {
    return [];
  }

  if (keyFn) {
    const seen = new Set();
    return array.filter(item => {
      const key = keyFn(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  return [...new Set(array)];
}

/**
 * Flatten nested array
 * @param {Array} array - Array to flatten
 * @param {number} depth - Flattening depth (default: Infinity)
 * @returns {Array} - Flattened array
 * 
 * @example
 * flatten([1, [2, [3, 4]]]); // [1, 2, 3, 4]
 */
export function flatten(array, depth = Infinity) {
  if (!Array.isArray(array)) {
    return [];
  }

  return array.flat(depth);
}

/**
 * Group array items by a key
 * @param {Array} array - Array to group
 * @param {Function|string} keyFn - Function or property name to group by
 * @returns {Object} - Object with grouped items
 * 
 * @example
 * groupBy([{type: 'a', val: 1}, {type: 'b', val: 2}], 'type');
 * // { a: [{type: 'a', val: 1}], b: [{type: 'b', val: 2}] }
 */
export function groupBy(array, keyFn) {
  if (!Array.isArray(array)) {
    return {};
  }

  const getKey = typeof keyFn === 'function' 
    ? keyFn 
    : (item) => item[keyFn];

  return array.reduce((groups, item) => {
    const key = getKey(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
}

/**
 * Sort array by a key
 * @param {Array} array - Array to sort
 * @param {Function|string} keyFn - Function or property name to sort by
 * @param {string} order - Sort order ('asc' or 'desc', default: 'asc')
 * @returns {Array} - Sorted array (new array, doesn't mutate original)
 * 
 * @example
 * sortBy([{age: 30}, {age: 20}], 'age'); // [{age: 20}, {age: 30}]
 */
export function sortBy(array, keyFn, order = 'asc') {
  if (!Array.isArray(array)) {
    return [];
  }

  const getValue = typeof keyFn === 'function'
    ? keyFn
    : (item) => item[keyFn];

  const sorted = [...array].sort((a, b) => {
    const aVal = getValue(a);
    const bVal = getValue(b);

    if (aVal < bVal) {
      return order === 'asc' ? -1 : 1;
    }
    if (aVal > bVal) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return sorted;
}

/**
 * Get array intersection (common elements)
 * @param {Array} array1 - First array
 * @param {Array} array2 - Second array
 * @returns {Array} - Array of common elements
 * 
 * @example
 * intersection([1, 2, 3], [2, 3, 4]); // [2, 3]
 */
export function intersection(array1, array2) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return [];
  }

  return array1.filter(item => array2.includes(item));
}

/**
 * Get array difference (elements in array1 but not in array2)
 * @param {Array} array1 - First array
 * @param {Array} array2 - Second array
 * @returns {Array} - Array of different elements
 * 
 * @example
 * difference([1, 2, 3], [2, 3, 4]); // [1]
 */
export function difference(array1, array2) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return Array.isArray(array1) ? array1 : [];
  }

  return array1.filter(item => !array2.includes(item));
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array (new array, doesn't mutate original)
 * 
 * @example
 * shuffle([1, 2, 3, 4]); // [3, 1, 4, 2] (random)
 */
export function shuffle(array) {
  if (!Array.isArray(array)) {
    return [];
  }

  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Get random element from array
 * @param {Array} array - Array to sample from
 * @returns {*} - Random element or undefined if array is empty
 * 
 * @example
 * sample([1, 2, 3, 4]); // 3 (random)
 */
export function sample(array) {
  if (!Array.isArray(array) || array.length === 0) {
    return undefined;
  }

  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Partition array into two arrays based on predicate
 * @param {Array} array - Array to partition
 * @param {Function} predicate - Function that returns true/false
 * @returns {[Array, Array]} - Tuple of [truthy items, falsy items]
 * 
 * @example
 * partition([1, 2, 3, 4], n => n % 2 === 0); // [[2, 4], [1, 3]]
 */
export function partition(array, predicate) {
  if (!Array.isArray(array)) {
    return [[], []];
  }

  const truthy = [];
  const falsy = [];

  array.forEach(item => {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  });

  return [truthy, falsy];
}

/**
 * Get last N elements from array
 * @param {Array} array - Array
 * @param {number} n - Number of elements to get
 * @returns {Array} - Last N elements
 * 
 * @example
 * takeLast([1, 2, 3, 4], 2); // [3, 4]
 */
export function takeLast(array, n = 1) {
  if (!Array.isArray(array)) {
    return [];
  }

  return array.slice(-n);
}

/**
 * Get first N elements from array
 * @param {Array} array - Array
 * @param {number} n - Number of elements to get
 * @returns {Array} - First N elements
 * 
 * @example
 * takeFirst([1, 2, 3, 4], 2); // [1, 2]
 */
export function takeFirst(array, n = 1) {
  if (!Array.isArray(array)) {
    return [];
  }

  return array.slice(0, n);
}

