import { useCallback } from 'react';

export const useAmountInput = () => {
  const sanitizeAmount = useCallback((value: string): string => {
    const sanitizedValue = value.replace(/[^0-9.]/g, '');

    const parts = sanitizedValue.split('.');
    const formattedValue = parts.length > 2
      ? parts[0] + '.' + parts.slice(1).join('')
      : sanitizedValue;

    return formattedValue;
  }, []);

  const formatDisplayValue = useCallback((amount: string, price?: number): string => {
    if (!amount || !price) return '';
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return '';
    return `≈ $${(numericAmount * price).toFixed(2)}`;
  }, []);

  return {
    sanitizeAmount,
    formatDisplayValue
  };
};
