import React, { useState } from 'react';

interface SwapButtonProps {
  onSwap: () => void;
  disabled: boolean;
  className?: string;
}

const SwapButton: React.FC<SwapButtonProps> = ({
  onSwap,
  disabled,
  className = ""
}) => {
  const [isRotating, setIsRotating] = useState(false);

  const handleClick = () => {
    setIsRotating(true);
    onSwap();
    setTimeout(() => setIsRotating(false), 300);
  };
  return (
    <div className={`flex justify-center h-0 -mt-7 relative z-10 ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        className={`w-12 h-8 rounded-full bg-gray-800 border-3 border-gray-600 flex items-center justify-center ${disabled
          ? 'opacity-40'
          : 'hover:border-emerald-500'
          }`}
        disabled={disabled}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`w-5 h-5 text-gray-300 ${isRotating ? 'transition-transform duration-300 ease-in-out rotate-180' : 'transition-none'
            }`}
        >
          <path
            d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default SwapButton;
