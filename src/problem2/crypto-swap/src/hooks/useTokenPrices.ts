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

  useEffect(() => {
    const processTokens = async () => {
      if (tokenPrices.length === 0) {
        setTokens([]);
        return;
      }

      const latestPrices = getLatestPrices(tokenPrices);
      const initialTokens = await createTokensFromPrices(latestPrices);
      setTokens(initialTokens);

      setTimeout(async () => {
        const tokensWithIcons = await prefetchIconDataIntoTokens(initialTokens);
        setTokens(tokensWithIcons);
      }, 0);
    };
    processTokens();
  }, [tokenPrices]);

  const priceMap = useMemo(() => {
    return new Map(
      tokens
        .filter((token: Token) => token.price !== undefined)
        .map((token: Token) => [token.symbol, token.price!])
    );
  }, [tokens]);



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

const prefetchIconDataIntoTokens = async (tokens: Token[]): Promise<Token[]> => {
  return Promise.all(
    tokens.map(async (token) => {
      if (!token.icon.startsWith('https')) {
        return token;
      }

      try {
        const iconInfo = await fetchTokenInfo(token.symbol);
        return {
          ...token,
          ...iconInfo,
        };
      } catch (error) {
        console.warn(`Failed to fetch icon data for ${token.symbol}:`, error);
        return token;
      }
    })
  );
};

const fetchTokenInfo = async (symbol: string): Promise<{ symbol: string; icon: string }> => {
  const url = getTokenIconUrl(symbol);

  try {
    const response = await fetch(url);
    if (response.ok) {
      const imageData = await response.text();
      return { symbol, icon: imageData };
    }
  } catch {
    // If default URL fails, continue to fallback
  }

  const fallbackSymbol = symbol.replace(/^ST/g, 'st').replace(/^R/g, 'r');
  if (fallbackSymbol !== symbol) {
    return fetchTokenInfo(fallbackSymbol);
  }

  return { symbol, icon: url };
};

const getTokenIconUrl = (symbol: string): string => `${TOKEN_ICONS_BASE_URL}/${symbol}.svg`;

const createTokensFromPrices = async (latestPrices: Map<string, TokenPrice>): Promise<Token[]> => {
  const tokens = Array.from(latestPrices.entries()).map(([symbol, priceData]) => ({
    symbol,
    icon: getTokenIconUrl(symbol),
    price: priceData.price
  }));

  return sortTokensByPopularity(tokens);
};

const sortTokensByPopularity = (tokens: Token[]): Token[] => {
  return tokens.sort((a, b) => {
    const popularityA = getPopularityIndex(a.symbol);
    const popularityB = getPopularityIndex(b.symbol);

    if (popularityA !== popularityB) {
      return popularityA - popularityB;
    }

    return a.symbol.localeCompare(b.symbol);
  });
};


