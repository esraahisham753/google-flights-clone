/**
 * Check if a date is valid and in the future
 * @param {Date} date - The date to validate
 * @returns {boolean} True if date is valid and in the future
 */
export const isValidFutureDate = (date) => {
  if (!(date instanceof Date) || isNaN(date)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

/**
 * Format a date object to YYYY-MM-DD string
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDateToString = (date) => {
  if (!(date instanceof Date)) return null;
  return date.toISOString().split('T')[0];
};