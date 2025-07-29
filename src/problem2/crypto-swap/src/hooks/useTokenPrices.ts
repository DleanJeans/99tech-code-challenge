import { useState, useEffect, useMemo, useCallback } from 'react';
import type { TokenPrice, Token } from '../types';
import { getPopularityIndex } from '../data/popularCryptos';

const PRICES_API_URL = 'https://interview.switcheo.com/prices.json';
const TOKEN_ICONS_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

export const useTokenPrices = () => {
  const [tokenPrices, setTokenPrices] = useState<TokenPrice[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processTokens = async () => {
      if (tokenPrices.length === 0) {
        setTokens([]);
        return;
      }

      const latestPrices = getLatestPrices(tokenPrices);
      const processedTokens = await createTokensFromPrices(latestPrices);
      setTokens(processedTokens);
    };

    processTokens();
  }, [tokenPrices]);

  const priceMap = useMemo(() => {
    const map = new Map<string, number>();
    tokens.forEach((token: Token) => {
      if (token.price !== undefined) {
        map.set(token.symbol, token.price);
      }
    });
    return map;
  }, [tokens]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(PRICES_API_URL);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const prices: TokenPrice[] = await response.json();

        if (!Array.isArray(prices)) {
          throw new Error('Invalid data format: expected array');
        }

        setTokenPrices(prices);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch token prices';
        setError(errorMessage);
        console.error('Error fetching token prices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const getTokenPrice = useCallback((symbol: string): number | undefined => {
    return priceMap.get(symbol);
  }, [priceMap]);

  const calculateExchangeRate = useCallback((fromSymbol: string, toSymbol: string): number => {
    const fromPrice = getTokenPrice(fromSymbol);
    const toPrice = getTokenPrice(toSymbol);

    if (!fromPrice || !toPrice || toPrice === 0) {
      return 0;
    }

    return fromPrice / toPrice;
  }, [getTokenPrice]);

  return {
    tokens,
    tokenPrices,
    loading,
    error,
    getTokenPrice,
    calculateExchangeRate,
  };

};

const getLatestPrices = (prices: TokenPrice[]): Map<string, TokenPrice> => {
  const latestPricesMap = new Map<string, TokenPrice>();

  prices.forEach(price => {
    const existing = latestPricesMap.get(price.currency);
    if (!existing || new Date(price.date) > new Date(existing.date)) {
      latestPricesMap.set(price.currency, price);
    }
  });

  return latestPricesMap;
};

const getTokenInfo = async (symbol: string): Promise<{ symbol: string; icon: string }> => {
  const primaryUrl = `${TOKEN_ICONS_BASE_URL}/${symbol}.svg`;

  try {
    const response = await fetch(primaryUrl);
    if (response.ok) {
      const imageData = await response.text(); // Get SVG as text
      return { symbol, icon: imageData };
    }
  } catch {
    // If primary URL fails, continue to fallback
  }

  const fallbackSymbol = symbol.replace(/^ST/g, 'st').replace(/^R/g, 'r');
  const fallbackUrl = `${TOKEN_ICONS_BASE_URL}/${fallbackSymbol}.svg`;

  try {
    const fallbackResponse = await fetch(fallbackUrl);
    if (fallbackResponse.ok) {
      const imageData = await fallbackResponse.text();
      return { symbol: fallbackSymbol, icon: imageData };
    }
  } catch {
    // If fallback also fails, return empty icon data
  }

  return { symbol: fallbackSymbol, icon: '' };
};

const createTokensFromPrices = async (latestPrices: Map<string, TokenPrice>): Promise<Token[]> => {
  const tokenPromises = Array.from(latestPrices.entries())
    .map(async ([symbol, priceData]) => {
      const info = await getTokenInfo(symbol);

      return {
        symbol: info.symbol,
        icon: info.icon,
        price: priceData.price
      }
    });

  const tokens = await Promise.all(tokenPromises);

  return tokens.sort((a, b) => {
    const popularityA = getPopularityIndex(a.symbol);
    const popularityB = getPopularityIndex(b.symbol);

    if (popularityA !== popularityB) {
      return popularityA - popularityB;
    }

    return a.symbol.localeCompare(b.symbol);
  });
};


