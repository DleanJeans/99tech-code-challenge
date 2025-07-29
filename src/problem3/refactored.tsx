interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // missing property used for getPriority()
}

interface FormattedWalletBalance extends WalletBalance { // extends instead of duplicating properties
  formatted: string;
  usdValue: number; // new property for memoization
}

interface Props extends BoxProps { }

const NO_PRIORITY = -99; // use constant instead of magic number
const PRIORITY_DB: Record<string, number> = { // convert switch case to Record dictionary
  'Osmosis': 100,
  'Ethereum': 50,
  'Arbitrum': 30,
  'Zilliqa': 20,
  'Neo': 20
}

const getPriority = (blockchain: string): number => { // move out of WalletPage
  return PRIORITY_DB[blockchain] || NO_PRIORITY;
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances: WalletBalance[] = useWalletBalances();
  const prices = usePrices();

  const formattedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      return balancePriority > NO_PRIORITY && balance.amount > 0; // correct and simplify if statements and flip balance.amount check
    }).sort((left: WalletBalance, right: WalletBalance) => {
      const leftPriority = getPriority(left.blockchain);
      const rightPriority = getPriority(right.blockchain);
      return rightPriority - leftPriority; // sort by priority descending
    }).map((balance: WalletBalance) => ({
      ...balance,
      formatted: balance.amount.toFixed(),
      usdValue: prices[balance.currency] * balance.amount // calculate and memoize USD value
    }));
  }, [balances, prices]);

  const rows = formattedBalances.map((balance: FormattedWalletBalance) => (
    <WalletRow
      className={classes.row}
      key={`${balance.blockchain}-${balance.currency}`} // use blockchain and currency as key to avoid rendering issues
      amount={balance.amount}
      usdValue={balance.usdValue} // use memoized usdValue from FormattedWalletBalance
      formattedAmount={balance.formatted}
    />
  ));

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}