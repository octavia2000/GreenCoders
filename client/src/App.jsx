import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './app/(landing)/page';
import ExplorePage from './app/(landing)/explore/page';
import LoginPage from './app/(auth)/login/page';
import RegisterPage from './app/(auth)/register/page';
import ForgotPasswordPage from './app/(auth)/forgot-password/page';
import ResetPasswordPage from './app/(auth)/reset-password/page';
import EmailVerificationPage from './app/(auth)/email-verification/page';
import Layout from './Layout';
import { ProductsPage } from './components/Products';
import NotFoundPage from './app/not-found';
import { ToastProvider } from './components/providers/ToastProvider';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Landing routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/products" element={<ProductsPage />} />
          </Route>
          
          {/* Auth routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/email-verification" element={<EmailVerificationPage />} />
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToastProvider />
      </div>
    </Router>
  );
}

export default App;