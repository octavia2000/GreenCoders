import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../actions/auth.action';

export const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { user, token } = useAuthStore();
  const location = useLocation();

  // Check localStorage as fallback
  const localStorageToken = localStorage.getItem('greencoders_token');
  const localStorageUser = localStorage.getItem('auth-storage');
  
  // If we have localStorage data but Zustand hasn't hydrated yet, use localStorage
  const hasAuth = (user && token) || (localStorageToken && localStorageUser);

  // If route requires authentication but user is not authenticated
  if (requireAuth && !hasAuth) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If route doesn't require authentication but user is already authenticated
  if (!requireAuth && hasAuth) {
    return <Navigate to="/products" replace />;
  }

  return children;
};

export const AuthRoute = ({ children }) => {
  return <ProtectedRoute requireAuth={false}>{children}</ProtectedRoute>;
};

export const PrivateRoute = ({ children }) => {
  return <ProtectedRoute requireAuth={true}>{children}</ProtectedRoute>;
};

export const RegistrationFlowRoute = ({ children }) => {
  const location = useLocation();
  const { user, token } = useAuthStore();

  // If user is already authenticated, redirect to products
  if (user && token) {
    return <Navigate to="/products" replace />;
  }

  // Check if coming from registration flow
  const isFromRegistration = location.state?.fromRegistration === true;
  const hasPhoneNumber = location.state?.phoneNumber;

  // If not from registration flow or missing phone number, redirect to register
  if (!isFromRegistration || !hasPhoneNumber) {
    return <Navigate to="/auth/register" replace />;
  }

  return children;
};
