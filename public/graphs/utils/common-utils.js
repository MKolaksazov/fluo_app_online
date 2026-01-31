/**
 * ==========================================
 * UTILITY FUNCTIONS MODULE
 * Common array and data manipulation utilities
 * ==========================================
 */

const ArrayUtils = {
  /**
   * Converts 2D array to array of point objects
   */
  toPoints(arr) {
    return arr[0].map((x, i) => ({ x, y: arr[1][i] }));
  },

  /**
   * Transposes a 2D array
   */
  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  },

  /**
   * Creates a 2D array with specified dimensions
   */
  create2D(rows, cols, fillValue = undefined) {
    return Array(rows).fill(null).map(() => Array(cols).fill(fillValue));
  },

  /**
   * Shifts array elements forward (adds undefined at start, removes last)
   */
  shiftForward(arr) {
    const result = [...arr];
    result.unshift(undefined);
    result.pop();
    return result;
  },

  /**
   * Shifts array elements backward (removes first, adds undefined at end)
   */
  shiftBackward(arr) {
    const result = [...arr];
    result.shift();
    result.push(undefined);
    return result;
  },

  /**
   * Deep clones an object/array using JSON
   */
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Filters out undefined/null values
   */
  compact(arr) {
    return arr.filter(value => value != null);
  },

  /**
   * Groups array elements by a key function
   */
  groupBy(arr, keyFn) {
    return arr.reduce((groups, item) => {
      const key = keyFn(item);
      (groups[key] = groups[key] || []).push(item);
      return groups;
    }, {});
  }
};

const MathUtils = {
  /**
   * Calculates mean of array
   */
  mean(arr) {
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  },

  /**
   * Finds min value in array
   */
  min(arr) {
    return Math.min(...arr);
  },

  /**
   * Finds max value in array
   */
  max(arr) {
    return Math.max(...arr);
  },

  /**
   * Rounds to specified decimal places
   */
  round(value, decimals = 2) {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
};

const StringUtils = {
  /**
   * Generates letter sequence (a, b, c, ...)
   */
  letterFromIndex(index) {
    return String.fromCharCode(97 + index);
  },

  /**
   * Converts index to column name (A, B, C, ... Z, AA, AB, ...)
   */
  columnName(index) {
    let name = '';
    while (index >= 0) {
      name = String.fromCharCode(65 + (index % 26)) + name;
      index = Math.floor(index / 26) - 1;
    }
    return name;
  }
};
/*
// Export utilities
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ArrayUtils, MathUtils, StringUtils };
}
*/
