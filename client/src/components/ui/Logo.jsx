import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

export function Logo({ 
  size = 'default', 
  showText = true, 
  className = '',
  linkTo = '/'
}) {
  const sizeClasses = {
    sm: 'h-6',
    default: 'h-8',
    lg: 'h-12',
    xl: 'h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    default: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <Link to={linkTo} className={`flex items-center space-x-2 ${className}`}>
      <img 
        src={logo} 
        alt="GreenCoders Logo" 
        className={`${sizeClasses[size]} w-auto`} 
      />
      {showText && (
        <span className={`text-black font-bold ${textSizeClasses[size]}`}>
          GreenCode
        </span>
      )}
    </Link>
  );
}