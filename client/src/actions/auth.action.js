import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../lib/services/auth.service';
import toast from 'react-hot-toast';

// Auth store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      
      // Actions
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authService.login(credentials);
          
          if (result.success) {
            set({ 
              user: result.data.user, 
              isLoading: false, 
              error: null 
            });
            toast.success('Welcome back! You\'re now logged in.');
            return { success: true, user: result.data.user };
          } else {
            set({ 
              isLoading: false, 
              error: result.error || 'Login failed' 
            });
            toast.error(result.error || 'Login failed');
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Login failed'
          });
          toast.error(error.message || 'Login failed');
          
          // Check if it's a phone verification error
          if (error.message && (
            error.message.includes('Phone number not verified') || 
            error.message.includes('verify your phone number')
          )) {
            // Extract phone number from error response if available
            let phoneNumber = credentials.phoneNumber;
            if (error.response && error.response.data && error.response.data.phoneNumber) {
              phoneNumber = error.response.data.phoneNumber;
            }
            
            return { 
              success: false, 
              error: 'Phone number not verified. Please verify your phone number first.',
              requiresPhoneVerification: true,
              phoneNumber: phoneNumber
            };
          }
          
          // Handle specific error messages
          if (error.message && error.message.includes('Invalid password')) {
            return { success: false, error: 'Invalid password. Please check your password and try again.' };
          }
          
          if (error.message && error.message.includes("Account with the specified email doesn't exist")) {
            return { success: false, error: 'Account not found. Please check your email address.' };
          }
          
          return { success: false, error: error.message };
        }
      },
      
      logout: async () => {
        try {
          await authService.logout();
          set({ user: null, token: null, error: null });
        } catch (error) {
          set({ user: null, token: null, error: null });
        }
      },
      
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authService.register(userData);
          
          if (result.success) {
            set({ 
              user: result.data.user, 
              isLoading: false, 
              error: null 
            });
            toast.success('Account created successfully! Please verify your phone number.');
            return { success: true, user: result.data.user };
          } else {
            set({ 
              isLoading: false, 
              error: result.error || 'Registration failed' 
            });
            toast.error(result.error || 'Registration failed');
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Registration failed' 
          });
          toast.error(error.message || 'Registration failed');
          return { success: false, error: error.message };
        }
      },
      
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authService.forgotPassword(email);
          
          if (result.success) {
            set({ isLoading: false, error: null });
            return { success: true };
          } else {
            set({ 
              isLoading: false, 
              error: result.error || 'Failed to send reset email' 
            });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to send reset email' 
          });
          return { success: false, error: error.message };
        }
      },
      
      resetPassword: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authService.resetPassword(data);
          
          if (result.success) {
            set({ isLoading: false, error: null });
            return { success: true };
          } else {
            set({ 
              isLoading: false, 
              error: result.error || 'Failed to reset password' 
            });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to reset password' 
          });
          return { success: false, error: error.message };
        }
      },
      
      verifyEmail: async (otp, phoneNumber) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authService.verifyOtp(phoneNumber, otp);
          
          if (result.success) {
            set({ isLoading: false, error: null });
            return { success: true };
          } else {
            set({ 
              isLoading: false, 
              error: result.error || 'Invalid verification code' 
            });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Invalid verification code' 
          });
          return { success: false, error: error.message };
        }
      },

      resendOtp: async (phoneNumber) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authService.resendOtp(phoneNumber);
          
          if (result.success) {
            set({ isLoading: false, error: null });
            return { success: true };
          } else {
            set({ 
              isLoading: false, 
              error: result.error || 'Failed to resend OTP' 
            });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to resend OTP' 
          });
          return { success: false, error: error.message };
        }
      },

      googleAuth: async (idToken) => {
        set({ isLoading: true, error: null });
        try {
          console.log('Auth action: Starting Google auth with ID token');
          const result = await authService.googleAuth(idToken);
          console.log('Auth action: Google auth result:', result);
          
          if (result.success) {
            // Store user data similar to src folder structure
            const userData = result.data;
            set({ 
              user: userData, 
              token: userData.token || userData.access_token,
              isLoading: false, 
              error: null 
            });
            
            // Store token in localStorage for persistence
            if (userData.token || userData.access_token) {
              localStorage.setItem('greencoders_token', userData.token || userData.access_token);
            }
            
            toast.success('Welcome to GreenCoders! You\'re now logged in.');
            return { 
              success: true, 
              user: userData,
              message: result.message || 'Authentication Successful'
            };
          } else {
            set({ 
              isLoading: false, 
              error: result.error || 'Google authentication failed' 
            });
            toast.error(result.error || 'Google authentication failed');
            return { 
              success: false, 
              error: result.error,
              status: result.status
            };
          }
        } catch (error) {
          console.error('Auth action: Google auth error:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Google authentication failed' 
          });
          return { 
            success: false, 
            error: error.message,
            status: error.status || 500
          };
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
    }
  )
);

// Auth actions hook
export const useAuthActions = () => {
  const store = useAuthStore();
  
  return {
    user: store.user,
    token: store.token,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    logout: store.logout,
    register: store.register,
    forgotPassword: store.forgotPassword,
    resetPassword: store.resetPassword,
    verifyEmail: store.verifyEmail,
    resendOtp: store.resendOtp,
    googleAuth: store.googleAuth,
    clearError: store.clearError,
    setError: store.setError,
    setUser: store.setUser,
    setToken: store.setToken
  };
};
