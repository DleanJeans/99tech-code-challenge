export const POPULAR_CRYPTOS = [
  'ETH',
  'USD',
  'WBTC',
  'USDC',
  'BUSD',
  'LUNA',
  'USC',
];

export const getPopularityIndex = (symbol: string): number => {
  const index = POPULAR_CRYPTOS.indexOf(symbol.toUpperCase());
  return index !== -1 ? index : 9999;
};
