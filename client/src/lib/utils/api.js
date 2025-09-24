// API utility functions
import { appConfig } from '../config/app.config';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/api.constants';

class ApiClient {
  constructor() {
    this.baseURL = appConfig.api.baseUrl;
    this.timeout = appConfig.api.timeout;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem(appConfig.auth.tokenKey);
    
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error) 
      };
    }
  }

  getErrorMessage(error) {
    if (error.name === 'AbortError') {
      return ERROR_MESSAGES.TIMEOUT;
    }
    
    if (error.message.includes('401')) {
      return ERROR_MESSAGES.UNAUTHORIZED;
    }
    
    if (error.message.includes('403')) {
      return ERROR_MESSAGES.FORBIDDEN;
    }
    
    if (error.message.includes('404')) {
      return ERROR_MESSAGES.NOT_FOUND;
    }
    
    if (error.message.includes('500')) {
      return ERROR_MESSAGES.SERVER_ERROR;
    }
    
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // HTTP methods
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
