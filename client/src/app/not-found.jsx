import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Logo } from '../components/ui/Logo';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo size="lg" showText={true} />
        </div>

        {/* 404 Content */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
          <p className="text-gray-600 font-poppins">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="w-full sm:w-auto">
            <Link to="/">
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/explore">
              Browse Products
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-sm text-gray-500">
          <p>Need help? <Link to="/contact" className="text-eco-600 hover:text-eco-700">Contact our support team</Link></p>
        </div>
      </div>
    </div>
  );
}
