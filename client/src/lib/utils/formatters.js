// Utility functions for formatting data

/**
 * Format currency values
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format CO₂ impact values
 * @param {number} amount - CO₂ amount in kg
 * @param {number} precision - Decimal places (default: 2)
 * @returns {string} Formatted CO₂ string
 */
export const formatCO2Impact = (amount, precision = 2) => {
  if (amount === 0) return '0 kg CO₂';
  if (amount < 0.01) return '<0.01 kg CO₂';
  
  return `${amount.toFixed(precision)} kg CO₂`;
};

/**
 * Format large numbers with appropriate units
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Format date strings
 * @param {string|Date} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  return new Intl.DateTimeFormat('en-US', {
    ...defaultOptions,
    ...options
  }).format(new Date(date));
};

/**
 * Format percentage values
 * @param {number} value - Value to format as percentage
 * @param {number} precision - Decimal places (default: 1)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, precision = 1) => {
  return `${(value * 100).toFixed(precision)}%`;
};

/**
 * Format product names for display
 * @param {string} name - Product name
 * @param {number} maxLength - Maximum length (default: 50)
 * @returns {string} Truncated product name
 */
export const formatProductName = (name, maxLength = 50) => {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength - 3) + '...';
};

/**
 * Format sustainability score
 * @param {number} score - Score from 0-100
 * @returns {object} Formatted score with label and color
 */
export const formatSustainabilityScore = (score) => {
  if (score >= 80) {
    return { label: 'Excellent', color: 'eco-600', score };
  }
  if (score >= 60) {
    return { label: 'Good', color: 'eco-500', score };
  }
  if (score >= 40) {
    return { label: 'Fair', color: 'yellow-500', score };
  }
  return { label: 'Poor', color: 'red-500', score };
};

/**
 * Generate a slug from a string
 * @param {string} text - Text to convert to slug
 * @returns {string} URL-friendly slug
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

/**
 * Capitalize first letter of each word
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalizeWords = (text) => {
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Format phone number for display
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return original if can't format
  return phoneNumber;
};