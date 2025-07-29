import React from 'react';

interface SubmitResultProps {
  success: boolean;
  message: string;
  className?: string;
}

const SubmitResult: React.FC<SubmitResultProps> = ({
  success,
  message,
  className = ""
}) => {
  return (
    <div
      className={`py-3 px-4 rounded-xl text-sm font-medium text-center ${success
        ? 'bg-green-900 text-green-300 border border-green-700'
        : 'bg-red-900 text-red-300 border border-red-700'
        } ${className}`}
    >
      {message}
    </div>
  );
};

export default SubmitResult;
