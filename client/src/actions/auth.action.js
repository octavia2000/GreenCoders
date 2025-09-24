import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
          // Mock login - replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock successful login
          const mockUser = {
            id: 1,
            email: credentials.email,
            name: 'John Doe',
            avatar: null
          };
          const mockToken = 'mock-jwt-token';
          
          set({ 
            user: mockUser, 
            token: mockToken, 
            isLoading: false, 
            error: null 
          });
          
          return { success: true, user: mockUser };
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Login failed' 
          });
          return { success: false, error: error.message };
        }
      },
      
      logout: () => {
        set({ user: null, token: null, error: null });
      },
      
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // Mock registration - replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock successful registration
          const mockUser = {
            id: 2,
            email: userData.email,
            name: userData.name || userData.email,
            avatar: null
          };
          const mockToken = 'mock-jwt-token';
          
          set({ 
            user: mockUser, 
            token: mockToken, 
            isLoading: false, 
            error: null 
          });
          
          return { success: true, user: mockUser };
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Registration failed' 
          });
          return { success: false, error: error.message };
        }
      },
      
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          // Mock forgot password - replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ isLoading: false, error: null });
          return { success: true };
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
          // Mock reset password - replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ isLoading: false, error: null });
          return { success: true };
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to reset password' 
          });
          return { success: false, error: error.message };
        }
      },
      
      verifyEmail: async (otp) => {
        set({ isLoading: true, error: null });
        try {
          // Mock email verification - replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ isLoading: false, error: null });
          return { success: true };
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Invalid verification code' 
          });
          return { success: false, error: error.message };
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
    clearError: store.clearError,
    setUser: store.setUser,
    setToken: store.setToken
  };
};
