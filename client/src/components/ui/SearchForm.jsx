import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search } from 'lucide-react';

const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query too long')
});

export function SearchForm({ 
  placeholder = "Search products...", 
  onSubmit,
  className = "",
  size = "default"
}) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: '' }
  });

  const handleFormSubmit = (data) => {
    onSubmit?.(data.query);
  };

  const sizeClasses = {
    sm: 'w-32 md:w-48',
    default: 'w-40 md:w-64',
    lg: 'w-48 md:w-80'
  };

  const inputSizeClasses = {
    sm: 'pl-8 pr-4 py-1.5 text-xs',
    default: 'pl-10 pr-4 py-2 text-sm',
    lg: 'pl-12 pr-4 py-3 text-base'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    default: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={`relative ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${iconSizeClasses[size]}`} />
        <input
          type="text"
          {...register('query')}
          placeholder={placeholder}
          className={`w-full bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-eco-500 focus:bg-white transition-colors ${inputSizeClasses[size]} ${
            errors.query ? 'border-red-300' : 'border-transparent'
          }`}
        />
      </div>
      {errors.query && (
        <p className="absolute top-full left-0 mt-1 text-xs text-red-600">
          {errors.query.message}
        </p>
      )}
    </form>
  );
}