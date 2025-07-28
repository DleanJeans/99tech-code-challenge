interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // missing property used for getPriority()
}
interface FormattedWalletBalance extends WalletBalance { // extends instead of repeating properties
  formatted: string;
  usdValue: number; // new property for memoization
}

interface Props extends BoxProps { }

const NO_PRIORITY = -99; // use constant instead of magic number
const PRIORITY_DB: Record<string, number> = { // convert switch case to Record
  'Osmosis': 100,
  'Ethereum': 50,
  'Arbitrum': 30,
  'Zilliqa': 20,
  'Neo': 20
}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances: WalletBalance[] = useWalletBalances();
  const prices = usePrices();

  const getPriority = useCallback((blockchain: string): number => { // change blockchain type from any to string
    return PRIORITY_DB[blockchain] || NO_PRIORITY;
  }, [PRIORITY_DB]); // if PRIORITY_DB was from an API instead a constant

  const formattedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      return balancePriority > NO_PRIORITY && balance.amount > 0; // nested from if statements and flip balance.amount check
    }).sort((left: WalletBalance, right: WalletBalance) => {
      const leftPriority = getPriority(left.blockchain);
      const rightPriority = getPriority(right.blockchain);
      return rightPriority - leftPriority; // sort by priority descending
    }).map((balance: WalletBalance) => ({
	      ...balance,
	      formatted: balance.amount.toFixed(),
	      usdValue: prices[balance.currency] * balance.amount // calculate and memoize USD value
	    })
    );
  }, [balances, prices]);

  const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
    return (
      <WalletRow
        className={classes.row}
        key={balance.blockchain} // use blockchain as key to avoid rendering issues
        amount={balance.amount}
        usdValue={balance.usdValue} // use memoized usdValue from FormattedWalletBalance
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}