/**
 * Shared Utility Functions
 */

/**
 * Format a standardized API success response
 * @param {Object} data - Response data
 * @param {string} message - Success message
 * @returns {Object} Formatted response
 */
function successResponse(data, message = 'Success') {
  return {
    success: true,
    message,
    data,
  };
}

/**
 * Format a standardized API error response
 * @param {string} message - Error message
 * @param {Array} errors - Validation errors array
 * @returns {Object} Formatted error response
 */
function errorResponse(message = 'An error occurred', errors = []) {
  return {
    success: false,
    message,
    errors,
  };
}

/**
 * Sanitize string input — trim whitespace and lowercase
 * @param {string} str - Input string
 * @returns {string} Sanitized string
 */
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.trim().toLowerCase();
}

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Round a number to specified decimal places
 * @param {number} num
 * @param {number} decimals
 * @returns {number}
 */
function roundTo(num, decimals = 2) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

module.exports = {
  successResponse,
  errorResponse,
  sanitize,
  isValidEmail,
  roundTo,
};
