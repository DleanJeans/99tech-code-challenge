export interface TokenPrice {
  currency: string;
  date: string;
  price: number;
}

export interface Token {
  symbol: string;
  icon: string;
  price?: number;
}

export interface SwapFormData {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;
}

export interface SwapTransaction {
  id: string;
  from: {
    token: Token;
    amount: number;
  };
  to: {
    token: Token;
    amount: number;
  };
  exchangeRate: number;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
}
