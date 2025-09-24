// Local storage utilities
import { databaseConfig } from '../config/database.config';

export const storage = {
  // Set item with expiration
  setItem: (key, value, ttl = null) => {
    const item = {
      value,
      timestamp: Date.now(),
      ttl: ttl || databaseConfig.cache.ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  // Get item with expiration check
  getItem: (key) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      const now = Date.now();
      
      if (parsed.ttl && (now - parsed.timestamp) > parsed.ttl) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed.value;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },

  // Remove item
  removeItem: (key) => {
    localStorage.removeItem(key);
  },

  // Clear all items
  clear: () => {
    localStorage.clear();
  },

  // Check if item exists and is not expired
  hasItem: (key) => {
    return this.getItem(key) !== null;
  }
};

// Specific storage functions for app data
export const userStorage = {
  setUser: (user) => storage.setItem(databaseConfig.storage.user, user),
  getUser: () => storage.getItem(databaseConfig.storage.user),
  removeUser: () => storage.removeItem(databaseConfig.storage.user)
};

export const cartStorage = {
  setCart: (cart) => storage.setItem(databaseConfig.storage.cart, cart),
  getCart: () => storage.getItem(databaseConfig.storage.cart) || [],
  removeCart: () => storage.removeItem(databaseConfig.storage.cart)
};

export const preferencesStorage = {
  setPreferences: (preferences) => storage.setItem(databaseConfig.storage.preferences, preferences),
  getPreferences: () => storage.getItem(databaseConfig.storage.preferences) || {},
  removePreferences: () => storage.removeItem(databaseConfig.storage.preferences)
};
