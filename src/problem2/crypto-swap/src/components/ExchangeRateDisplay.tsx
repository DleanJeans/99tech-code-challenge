import React from 'react';

interface ExchangeRateDisplayProps {
  fromSymbol: string;
  toSymbol: string;
  rate: number;
  className?: string;
}

const ExchangeRateDisplay: React.FC<ExchangeRateDisplayProps> = ({
  fromSymbol,
  toSymbol,
  rate,
  className = ""
}) => {
  if (rate <= 0) return null;

  return (
    <div className={`text-center py-3 bg-gray-800 rounded-xl text-sm text-emerald-300 font-medium border border-gray-700 ${className}`}>
      1 {fromSymbol} = {rate.toFixed(8)} {toSymbol}
    </div>
  );
};

export default ExchangeRateDisplay;
