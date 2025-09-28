// App configuration
export const appConfig = {
  // App metadata
  name: 'GreenCoders',
  description: 'Sustainability Marketplace',
  version: '1.0.0',
  
  // API configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    timeout: 30000,
    retries: 3
  },
  
  // Authentication
  auth: {
    tokenKey: 'greencoders_token',
    refreshTokenKey: 'greencoders_refresh_token',
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // UI configuration
  ui: {
    theme: 'light',
    primaryColor: '#16a34a',
    borderRadius: '0.5rem',
    animationDuration: 200
  },
  
  // Features flags
  features: {
    enableGoogleAuth: true,
    enableEmailVerification: true,
    enablePasswordReset: true,
    enableNotifications: true
  },
  
  // Pagination
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 100
  },
  
  // File upload
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 5
  }
};
