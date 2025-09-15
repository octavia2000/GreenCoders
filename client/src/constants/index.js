// Application Constants

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const API_VERSION = 'v1';

// App Metadata
export const APP_NAME = 'GreenCoders';
export const APP_DESCRIPTION = 'Sustainability Marketplace - Shop Green, Impact Positively';
export const APP_VERSION = '1.0.0';

// Sustainability Metrics
export const CO2_CALCULATION_UNIT = 'kg';
export const DEFAULT_PRODUCT_IMPACT = 0;
export const IMPACT_PRECISION = 2; // decimal places

// User Roles
export const USER_ROLES = {
  SHOPPER: 'shopper',
  VENDOR: 'vendor',
  ADMIN: 'admin'
};

// Product Categories
export const PRODUCT_CATEGORIES = {
  CLOTHING: 'clothing',
  ELECTRONICS: 'electronics',
  HOME_GARDEN: 'home-garden',
  BEAUTY_PERSONAL: 'beauty-personal',
  FOOD_BEVERAGE: 'food-beverage',
  SPORTS_OUTDOORS: 'sports-outdoors'
};

// Eco Certifications
export const ECO_CERTIFICATIONS = {
  ORGANIC: 'organic',
  FAIR_TRADE: 'fair-trade',
  CARBON_NEUTRAL: 'carbon-neutral',
  RECYCLABLE: 'recyclable',
  BIODEGRADABLE: 'biodegradable',
  RENEWABLE_ENERGY: 'renewable-energy'
};

// UI Constants
export const TOAST_DURATION = 3000;
export const DEBOUNCE_DELAY = 300;
export const ITEMS_PER_PAGE = 12;

// Theme Colors (matching Tailwind config)
export const THEME_COLORS = {
  eco: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'greencoders_auth_token',
  USER_PREFERENCES: 'greencoders_user_preferences',
  CART_ITEMS: 'greencoders_cart_items',
  THEME: 'greencoders_theme'
};
