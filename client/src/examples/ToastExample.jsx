import React from 'react';
import { Toast, ToastContainer } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';

// Example usage in a component
export const ExampleToastUsage = () => {
  const { toasts, success, error, removeToast } = useToast();

  const handleSuccess = () => {
    success('Registration successful! Welcome to GreenCoders!');
  };

  const handleError = () => {
    error('Something went wrong. Please try again.');
  };

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={handleSuccess}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        Show Success Toast
      </button>
      
      <button
        onClick={handleError}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Show Error Toast
      </button>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};


