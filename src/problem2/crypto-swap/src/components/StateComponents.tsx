import React from 'react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading token prices...",
  className = ""
}) => (
  <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
    <div className="w-8 h-8 border-3 border-gray-700 border-t-blue-400 rounded-full mb-4 animate-spin"></div>
    <p className="text-gray-300">{message}</p>
  </div>
);

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  className = ""
}) => (
  <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
    <p className="text-red-400 mb-4 text-sm">Error loading token data: {error}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-sm"
      >
        Retry
      </button>
    )}
  </div>
);

export { LoadingState, ErrorState };
