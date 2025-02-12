/**
 * Validates if a date is in the future
 * @param {Date} date - The date to validate
 * @returns {boolean} True if date is valid and in the future
 */
export const isValidFutureDate = (date) => {
    // Check if date is valid
    if (!date || !(date instanceof Date) || isNaN(date)) {
      return false;
    }
  
    // Create today's date with time set to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    // Compare dates
    return date >= today;
  };
  
  /**
   * Formats a date object to YYYY-MM-DD string
   * @param {Date} date - The date to format
   * @returns {string|null} Formatted date string or null if date is invalid
   */
  export const formatDateToString = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) {
      return null;
    }
    return date.toISOString().split('T')[0];
  };