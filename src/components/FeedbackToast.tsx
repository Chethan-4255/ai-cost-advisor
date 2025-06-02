import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { FeedbackToastProps } from '../types';

const FeedbackToast: React.FC<FeedbackToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-20 right-4 z-50 animate-slide-up">
      <div
        className={`flex items-center p-3 rounded-lg shadow-lg ${
          type === 'success' ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'
        }`}
      >
        {type === 'success' ? (
          <CheckCircle size={18} className="mr-2" />
        ) : (
          <AlertCircle size={18} className="mr-2" />
        )}
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-3 p-1 rounded-full hover:bg-black hover:bg-opacity-10"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default FeedbackToast;