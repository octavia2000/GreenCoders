class GoogleOAuth {
  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    this.isLoaded = false;
    this.isInitialized = false;
  }

  async loadGoogleAPI() {
    if (this.isLoaded) return;
    
    return new Promise((resolve, reject) => {
      if (window.google) {
        this.isLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.isLoaded = true;
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google API'));
      };
      
      document.head.appendChild(script);
    });
  }

  async initialize() {
    if (this.isInitialized) return;
    
    console.log('Initializing Google OAuth...');
    await this.loadGoogleAPI();
    
    if (!this.clientId) {
      console.error('Google Client ID not configured');
      throw new Error('Google Client ID not configured. Please check your environment variables.');
    }

    console.log('Google Client ID found:', this.clientId ? 'Configured' : 'Not configured');

    try {
      // FedCM is now mandatory (September 2025), so we must enable it
    window.google.accounts.id.initialize({
      client_id: this.clientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: true,
        itp_support: true,
        ux_mode: 'popup',
        nonce: Math.random().toString(36).substring(2, 15),
        // Add proper FedCM configuration
        context: 'signin',
        // Add error callback for FedCM
        error_callback: (error) => {
          console.error('Google OAuth FedCM error:', error);
          if (this.onError) {
            this.onError(error);
          }
        }
      });
      this.isInitialized = true;
      console.log('Google OAuth initialized successfully with FedCM enabled');
    } catch (error) {
      console.error('Failed to initialize Google OAuth:', error);
      throw new Error('Failed to initialize Google OAuth: ' + error.message);
    }
  }

  handleCredentialResponse(response) {
    console.log('Google credential response received:', response);
    
    // Extract the ID token from the response
    const { credential } = response;
    
    if (!credential) {
      console.error('No credential received from Google');
      if (this.onError) {
        this.onError(new Error('No credential received from Google'));
      }
      return;
    }
    
    console.log('ID token extracted, length:', credential.length);
    
    if (this.onSuccess) {
      console.log('Calling onSuccess callback with ID token');
      this.onSuccess(credential);
    } else {
      console.warn('No onSuccess callback set');
    }
  }

  async renderButton(elementId, options = {}) {
    await this.initialize();
    
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id '${elementId}' not found`);
    }

    // Clear any existing content
    element.innerHTML = '';
    
    try {
    window.google.accounts.id.renderButton(element, {
      theme: 'outline',
      size: 'large',
      width: '100%',
      text: 'continue_with',
      shape: 'rectangular',
      ...options
    });
    } catch (error) {
      throw new Error('Failed to render Google button: ' + error.message);
    }
  }

  async prompt() {
    await this.initialize();
    
    return new Promise((resolve, reject) => {
      this.onSuccess = resolve;
      this.onError = reject;
      
      try {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          reject(new Error('Google sign-in was cancelled or not displayed'));
        }
      });
      } catch (error) {
        reject(new Error('Failed to prompt Google sign-in: ' + error.message));
      }
    });
  }

  async getCredential() {
    await this.initialize();
    
    return new Promise((resolve, reject) => {
      this.onSuccess = resolve;
      this.onError = reject;
      
      try {
        // Add a longer timeout to prevent hanging
        const timeout = setTimeout(() => {
          reject(new Error('Google sign-in timed out. Please try again.'));
        }, 60000); // 60 second timeout
        
        // Clear timeout when credential is received
        const originalOnSuccess = this.onSuccess;
        this.onSuccess = (credential) => {
          clearTimeout(timeout);
          originalOnSuccess(credential);
        };
        
        // Handle specific Google OAuth errors
        const originalOnError = this.onError;
        this.onError = (error) => {
          clearTimeout(timeout);
          console.error('Google OAuth error:', error);
          
          // Handle specific error types
          if (error.name === 'AbortError' || error.message.includes('AbortError')) {
            reject(new Error('Sign-in was cancelled or interrupted. Please try again.'));
          } else if (error.name === 'IdentityCredentialError' || error.message.includes('IdentityCredentialError')) {
            reject(new Error('Authentication failed. Please check your internet connection and try again.'));
          } else if (error.message.includes('network error') || error.message.includes('ERR_FAILED')) {
            reject(new Error('Network error. Please check your internet connection and try again.'));
          } else if (error.message.includes('token fetch')) {
            reject(new Error('Authentication service error. Please try again later.'));
          } else {
            reject(new Error('Google sign-in failed: ' + (error.message || 'Unknown error')));
          }
        };
        
        // Use FedCM-compatible prompt method
        try {
          window.google.accounts.id.prompt((notification) => {
            console.log('Google FedCM prompt notification:', notification);
            
            // Handle FedCM-specific notifications
            if (notification.isNotDisplayed()) {
              const reason = notification.getNotDisplayedReason();
              console.log('FedCM prompt not displayed, reason:', reason);
              
              if (reason === 'unregistered_origin') {
                reject(new Error('This domain is not authorized for Google sign-in. Please contact support.'));
              } else if (reason === 'popup_blocked') {
                reject(new Error('Sign-in popup was blocked. Please allow popups and try again.'));
              } else {
                reject(new Error(`Sign-in failed: ${reason}`));
              }
            } else if (notification.isSkippedMoment()) {
              console.log('FedCM prompt skipped');
              reject(new Error('Sign-in was skipped. Please try again.'));
            } else if (notification.isDismissedMoment()) {
              console.log('FedCM prompt dismissed');
              reject(new Error('Sign-in was cancelled. Please try again.'));
            }
          });
          console.log('Google FedCM prompt initiated');
        } catch (promptError) {
          console.error('Failed to prompt Google FedCM sign-in:', promptError);
          reject(new Error('Failed to initiate Google sign-in. Please try again.'));
        }
      } catch (error) {
        console.error('Error in getCredential:', error);
        reject(new Error('Failed to get Google credential: ' + error.message));
      }
    });
  }

  // Method to check if Google OAuth is properly configured
  isConfigured() {
    return !!this.clientId;
  }

  // Method to get configuration status
  getConfigStatus() {
    return {
      isConfigured: this.isConfigured(),
      clientId: this.clientId ? 'Configured' : 'Not configured',
      isLoaded: this.isLoaded,
      isInitialized: this.isInitialized
    };
  }

  // Alternative method using renderButton approach (more reliable)
  async getCredentialWithButton() {
    await this.initialize();
    
    return new Promise((resolve, reject) => {
      this.onSuccess = resolve;
      this.onError = reject;
      
      try {
        const timeout = setTimeout(() => {
          reject(new Error('Google sign-in timed out. Please try again.'));
        }, 60000);
        
        const originalOnSuccess = this.onSuccess;
        this.onSuccess = (credential) => {
          clearTimeout(timeout);
          originalOnSuccess(credential);
        };
        
        const originalOnError = this.onError;
        this.onError = (error) => {
          clearTimeout(timeout);
          console.error('Google button error:', error);
          reject(new Error('Google sign-in failed: ' + (error.message || 'Unknown error')));
        };
        
        // Create a temporary button element
        const tempDiv = document.createElement('div');
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);
        
        // Render Google button with FedCM support
        window.google.accounts.id.renderButton(tempDiv, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: 200,
          use_fedcm_for_prompt: true
        });
        
        // Simulate button click
        const button = tempDiv.querySelector('div[role="button"]');
        if (button) {
          button.click();
          console.log('Google button clicked');
        } else {
          reject(new Error('Failed to create Google sign-in button'));
        }
        
        // Clean up after timeout
        setTimeout(() => {
          if (document.body.contains(tempDiv)) {
            document.body.removeChild(tempDiv);
          }
        }, 60000);
        
      } catch (error) {
        console.error('Error in getCredentialWithButton:', error);
        reject(new Error('Failed to get Google credential: ' + error.message));
      }
    });
  }
}

export const googleOAuth = new GoogleOAuth();
