import { useState, useCallback } from 'react';
import type { SwapFormData } from '../types';

interface SubmitResult {
  success: boolean;
  message: string;
}

interface SubmissionConfig {
  successRate: number;
  minDelay: number;
  maxDelay: number;
}

const DEFAULT_CONFIG: SubmissionConfig = {
  successRate: 0.9,
  minDelay: 2000,
  maxDelay: 3000
};

export const useSwapSubmission = (config: SubmissionConfig = DEFAULT_CONFIG) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

  const submitSwap = useCallback(async (formData: SwapFormData): Promise<void> => {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      // Simulate API call with loading delay
      const delay = config.minDelay + Math.random() * (config.maxDelay - config.minDelay);
      await new Promise(resolve => setTimeout(resolve, delay));

      // Simulate random success/failure for demo
      const success = Math.random() < config.successRate;

      if (success) {
        setSubmitResult({
          success: true,
          message: `Successfully swapped ${formData.fromAmount} ${formData.fromToken?.symbol} for ${formData.toAmount} ${formData.toToken?.symbol}`
        });
      } else {
        setSubmitResult({
          success: false,
          message: 'Swap failed. Please try again later.'
        });
      }
    } catch {
      setSubmitResult({
        success: false,
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [config.successRate, config.minDelay, config.maxDelay]);

  const clearSubmitResult = useCallback(() => {
    setSubmitResult(null);
  }, []);

  return {
    isSubmitting,
    submitResult,
    submitSwap,
    clearSubmitResult
  };
};
