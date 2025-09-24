import { Logo } from './Logo';

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8 -mt-20 sm:-mt-24 pt-8 sm:pt-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-playfair">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-600 font-poppins">{subtitle}</p>
          )}
        </div>

        {/* Content */}
        <div className="relative">
          {children}
        </div>
      </div>
      
      {/* Footer - Responsive positioning */}
      <div className="absolute bottom-4 sm:bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 w-full flex justify-center px-4">
        <Logo size="default" showText={true} />
      </div>
    </div>
  );
}
