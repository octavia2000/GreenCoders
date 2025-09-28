import { apiClient } from '../utils/api';
import { API_ENDPOINTS } from '../constants/api.constants';

class AuthService {
  async register(userData) {
    console.log('Register data received:', userData);
    
    const phoneNumber = userData.phoneNumber || '';
    // Extract country code and phone number properly
    const phoneMatch = phoneNumber.match(/^(\+\d{1,4})\s?(.+)$/);
    
    let formattedPhoneNumber;
    if (phoneMatch) {
      const countryCode = phoneMatch[1]; // Keep the + sign
      const nationalNumber = phoneMatch[2].replace(/\D/g, ''); // Remove all non-digits
      formattedPhoneNumber = countryCode + nationalNumber;
    } else {
      // Fallback: clean all digits and add +234 if not present
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      formattedPhoneNumber = cleanPhoneNumber.startsWith('234') ? `+${cleanPhoneNumber}` : `+234${cleanPhoneNumber}`;
    }
    
    console.log('Formatted phone number:', formattedPhoneNumber);
    
    const requestData = {
      email: userData.email,
      password: userData.password,
      phoneNumber: formattedPhoneNumber
    };
    
    console.log('Sending to server:', requestData);
    
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, requestData);
    
    console.log('API Response:', response);
    
    if (response.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    }
    
    console.log('Registration failed:', response.error);
    return {
      success: false,
      error: response.error
    };
  }

  async login(credentials) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email: credentials.email,
      password: credentials.password
    });
    
    if (response.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    }
    
    return {
      success: false,
      error: response.error
    };
  }

  async logout() {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    
    if (response.success) {
      return {
        success: true,
        message: response.data.message
      };
    }
    
    return {
      success: false,
      error: response.error
    };
  }

  async verifyOtp(phoneNumber, otp) {
    console.log('verifyOtp called with:', { phoneNumber, otp });
    
    // Format phone number the same way as registration
    let formattedPhoneNumber;
    if (phoneNumber.startsWith('+')) {
      formattedPhoneNumber = phoneNumber;
    } else {
      // Add +234 if not present
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      formattedPhoneNumber = cleanPhoneNumber.startsWith('234') ? `+${cleanPhoneNumber}` : `+234${cleanPhoneNumber}`;
    }
    
    const requestData = {
      phoneNumber: formattedPhoneNumber,
      otp
    };
    
    console.log('Sending to server:', requestData);
    
    const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_OTP, requestData);
    
    if (response.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    }
    
    return {
      success: false,
      error: response.error
    };
  }

  async resendOtp(phoneNumber) {
    // Format phone number the same way as registration
    let formattedPhoneNumber;
    if (phoneNumber.startsWith('+')) {
      formattedPhoneNumber = phoneNumber;
    } else {
      // Add +234 if not present
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      formattedPhoneNumber = cleanPhoneNumber.startsWith('234') ? `+${cleanPhoneNumber}` : `+234${cleanPhoneNumber}`;
    }
    
    const response = await apiClient.post(API_ENDPOINTS.AUTH.RESEND_OTP, {
      phoneNumber: formattedPhoneNumber
    });
    
    if (response.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    }
    
    return {
      success: false,
      error: response.error
    };
  }

  async forgotPassword(email) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email
    });
    
    if (response.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    }
    
    return {
      success: false,
      error: response.error
    };
  }

  async resetPassword(data) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      email: data.email,
      newPassword: data.password,
      randomPassword: data.resetToken
    });
    
    if (response.success) {
      return {
        success: true,
        message: response.data.message
      };
    }
    
    return {
      success: false,
      error: response.error
    };
  }

  async googleAuth(idToken) {
    console.log('Sending Google ID token to backend:', { id_token: idToken });
    
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.GOOGLE, {
        id_token: idToken
      });
      
      console.log('Google auth response:', response);
      
      if (response.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Authentication Successful',
          status: response.status || 200
        };
      }
      
      return {
        success: false,
        status: response.status || 500,
        error: response.error || 'Google authentication failed'
      };
    } catch (error) {
      console.error('Google auth service error:', error);
      
      // Handle different types of errors similar to src folder
      if (error.response) {
        // Server responded with error status
        return {
          success: false,
          status: error.response.status || 500,
          error: error.response.data?.detail || 
                 error.response.data?.message || 
                 'Google sign in failed. Please try again.'
        };
      } else if (error.request) {
        // Network error
        return {
          success: false,
          status: 500,
          error: 'Network error. Please check your connection and try again.'
        };
      } else {
        // Other error
        return {
          success: false,
          status: 500,
          error: error.message || 'Google sign in failed. Please try again.'
        };
      }
    }
  }

  async validateToken() {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.VALIDATE_TOKEN);
    
    if (response.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
    
    return {
      success: false,
      error: response.error
    };
  }
}

export const authService = new AuthService();
