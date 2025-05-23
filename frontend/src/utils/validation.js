// UK-specific validation functions

/**
 * Validates a UK postcode format
 * @param {string} postcode - The postcode to validate
 * @returns {boolean} - True if valid UK postcode format
 */
export const isValidUKPostcode = (postcode) => {
  // UK postcode regex pattern
  const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
  return postcodeRegex.test(postcode);
};

/**
 * Validates a UK phone number format
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - True if valid UK phone number format
 */
export const isValidUKPhoneNumber = (phone) => {
  // UK phone number regex pattern (accepts various formats)
  const phoneRegex = /^(\+44\s?|0)\d{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Formats a date in UK format (DD-MM-YYYY)
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatUKDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}-${month}-${year}`;
};

/**
 * Parses a UK formatted date (DD-MM-YYYY) to a Date object
 * @param {string} dateString - The date string in DD-MM-YYYY format
 * @returns {Date} - Date object
 */
export const parseUKDate = (dateString) => {
  const [day, month, year] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Formats a currency value in UK pounds (£)
 * @param {number} value - The value to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(value);
};
