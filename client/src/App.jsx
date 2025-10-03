import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./app/(landing)/page";
import ExplorePage from "./app/(landing)/explore/page";
import LoginPage from "./app/(auth)/login/page";
import RegisterPage from "./app/(auth)/register/page";
import ForgotPasswordPage from "./app/(auth)/forgot-password/page";
import ResetPasswordPage from "./app/(auth)/reset-password/page";
import EmailVerificationPage from "./app/(auth)/email-verification/page";
import Layout from "./Layout";
import { ProductsPage } from "./app/Products";
import NotFoundPage from "./app/not-found";
import { ToastProvider } from "./components/providers/ToastProvider";
import Cart from "./app/cart(payment)/Cart";
import Payment from "./app/cart(payment)/Payment";
import { AuthRoute, RegistrationFlowRoute } from './components/auth/ProtectedRoute';

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
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<Payment />} />
          </Route>

          {/* Auth routes - only accessible when NOT authenticated */}
          <Route path="/auth/login" element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          } />
          <Route path="/auth/register" element={
            <AuthRoute>
              <RegisterPage />
            </AuthRoute>
          } />
          <Route
            path="/auth/forgot-password"
            element={
            <AuthRoute>
              <ForgotPasswordPage />
            </AuthRoute>
          }
          />
          <Route path="/auth/reset-password" element={
            <AuthRoute>
              <ResetPasswordPage />
            </AuthRoute>
          } />
          <Route
            path="/auth/email-verification"
            element={
            <RegistrationFlowRoute>
              <EmailVerificationPage />
            </RegistrationFlowRoute>
          }
          />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToastProvider />
      </div>
    </Router>
  );
}

export default App;
