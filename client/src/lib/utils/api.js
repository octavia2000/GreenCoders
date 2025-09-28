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
    
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include',
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
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.log('Server error response:', errorData);
          
          // Handle nested error structure
          if (errorData.message) {
            if (typeof errorData.message === 'object') {
              // If message is an object, try to extract the actual message
              if (errorData.message.message) {
                errorMessage = errorData.message.message;
              } else if (errorData.message.error) {
                errorMessage = errorData.message.error;
              } else {
                errorMessage = JSON.stringify(errorData.message);
              }
            } else {
              errorMessage = errorData.message;
            }
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          console.log('Could not parse error response:', e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  getErrorMessage(error) {
    if (error.name === 'AbortError') {
      return 'Request timed out. Please check your connection and try again.';
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

    if (error.message.includes('DOMException')) {
      return 'Network error. Please check if the server is running and try again.';
    }

    return error.message || ERROR_MESSAGES.NETWORK_ERROR;
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
