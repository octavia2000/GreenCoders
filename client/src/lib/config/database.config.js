// Database configuration (for client-side data management)
export const databaseConfig = {
  // Local storage keys
  storage: {
    user: 'greencoders_user',
    cart: 'greencoders_cart',
    preferences: 'greencoders_preferences',
    cache: 'greencoders_cache'
  },
  
  // Cache configuration
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 50, // Maximum number of cached items
    enabled: true
  },
  
  // Offline support
  offline: {
    enabled: true,
    syncInterval: 30 * 1000, // 30 seconds
    retryAttempts: 3
  }
};
