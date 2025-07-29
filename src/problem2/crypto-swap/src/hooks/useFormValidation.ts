import { useState, useCallback } from 'react';
import type { SwapFormData } from '../types';

interface ValidationErrors {
    fromAmount?: string;
    fromToken?: string;
    toToken?: string;
}

interface ValidationConfig {
    maxAmountUSD: number;
}

const DEFAULT_CONFIG: ValidationConfig = {
    maxAmountUSD: 15000000
};

export const useFormValidation = (config: ValidationConfig = DEFAULT_CONFIG) => {
    const [errors, setErrors] = useState<ValidationErrors>({});

    const clearError = useCallback((field: keyof ValidationErrors) => {
        setErrors(prev => ({ ...prev, [field]: undefined }));
    }, []);

    const clearAllErrors = useCallback(() => {
        setErrors({});
    }, []);

    const validateForm = useCallback((formData: SwapFormData): boolean => {
        const newErrors: ValidationErrors = {};

        if (!formData.fromToken) {
            newErrors.fromToken = 'Please select a token to swap from';
        }

        if (!formData.toToken) {
            newErrors.toToken = 'Please select a token to swap to';
        }

        if (formData.fromToken && formData.toToken && formData.fromToken.symbol === formData.toToken.symbol) {
            newErrors.toToken = 'Cannot swap to the same token';
        }

        if (!formData.fromAmount) {
            newErrors.fromAmount = 'Please enter an amount';
        } else {
            const amount = parseFloat(formData.fromAmount);
            if (isNaN(amount) || amount <= 0) {
                newErrors.fromAmount = 'Please enter a valid amount greater than 0';
            } else if (formData.fromToken?.price) {
                const usdValue = amount * formData.fromToken.price;
                if (usdValue > config.maxAmountUSD) {
                    newErrors.fromAmount = `Amount exceeds maximum USD value of $${config.maxAmountUSD.toLocaleString()}`;
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [config.maxAmountUSD]);

    const isFormValid = useCallback((formData: SwapFormData): boolean => {
        // Token validation
        if (!formData.fromToken || !formData.toToken) {
            return false;
        }

        if (formData.fromToken.symbol === formData.toToken.symbol) {
            return false;
        }

        // Amount validation
        if (!formData.fromAmount) {
            return false;
        }

        const amount = parseFloat(formData.fromAmount);
        if (isNaN(amount) || amount <= 0) {
            return false;
        }

        // USD value validation
        if (formData.fromToken?.price) {
            const usdValue = amount * formData.fromToken.price;
            if (usdValue > config.maxAmountUSD) {
                return false;
            }
        }

        return true;
    }, [config.maxAmountUSD]);

    const isAmountOverLimit = useCallback((formData: SwapFormData): boolean => {
        if (!formData.fromAmount || !formData.fromToken?.price) {
            return false;
        }

        const amount = parseFloat(formData.fromAmount);
        if (isNaN(amount) || amount <= 0) {
            return false;
        }

        const usdValue = amount * formData.fromToken.price;
        return usdValue > config.maxAmountUSD;
    }, [config.maxAmountUSD]);

    return {
        errors,
        validateForm,
        isFormValid,
        isAmountOverLimit,
        clearError,
        clearAllErrors,
        config
    };
};
