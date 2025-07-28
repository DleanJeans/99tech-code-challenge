Visit this [Notion page](https://dleanjeans.notion.site/Coding-Challenge-Problem-3-23d90f73c70780cbaa69dc399b2a01ae?source=repo) to view the Before/After code side by side

# `getPriority`

- is being redefined every render → `useCallback`
- uses clunky `switch case` → can be replaced with Record
- `-99` is a magic number → assign to a constant

## Before
```tsx
	const getPriority = (blockchain: any): number => {
	    switch (blockchain) {
	    case 'Osmosis':
	        return 100
	    case 'Ethereum':
	        return 50
	    case 'Arbitrum':
	        return 30
	    case 'Zilliqa':
	        return 20
	    case 'Neo':
	        return 20
	    default:
	        return -99
	    }
	}
```
## After
```tsx
const NO_PRIORITY = -99;
const PRIORITY_DB = {
  'Osmosis': 100,
  'Ethereum': 50,
  'Arbitrum': 30,
  'Zilliqa': 20,
  'Neo': 20
}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();
	
	const getPriority = useCallback((blockchain: string): number => {
    return PRIORITY_DB[blockchain] || NO_PRIORITY;
  }, [PRIORITY_DB]);
  
  ...
}
```

# `sortedBalances` / `formattedBalances`

- `lhsPriority` was not declared, should be `balancePriority`
- `balance.amount <= 0` why are we showing empty balances? → flip to `balance.amount > 0`  to display positive balances
- nested if statements inside `filter()` can be nested into an one-liner expression
- sorting in descending order → can be written as `rightPriority - leftPriority` instead of using `if else`  statements
- `formattedBalances` is unused and should be chained after `.map`

## Before
```tsx
	const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      if (lhsPriority > -99) { // lhsPriority -> should be balancePriority
          if (balance.amount <= 0) { // filtering out positive balances?
            return true; // if statements can be nested
          }
      }
      return false
    }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      if (leftPriority > rightPriority) {
        return -1;
      } else if (rightPriority > leftPriority) {
        return 1;
      }
    });
  }, [balances, prices]);
  
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })
```
## After
```tsx
	const formattedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      return balancePriority > NO_PRIORITY && balance.amount > 0;
    })
    
    
    
    
    .sort((left: WalletBalance, right: WalletBalance) => {
      const leftPriority = getPriority(left.blockchain);
      const rightPriority = getPriority(right.blockchain);
      return rightPriority - leftPriority;
    })
    
    
    
    
    
    
    .map((balance: WalletBalance) => ({
        ...balance,
        formatted: balance.amount.toFixed()
      }) as FormattedWalletBalance
    );
  }, [balances, prices]);
```

# `rows`

- using `index` as `key` can cause rendering issues if `PRIORITY_DB` changes → use `balance.currency`  or `balance.blockchain`
- `usdValue` can be memoized → add `usdValue` to `FormattedWalletBalance`  and to `formattedBalances = useMemo()` block

## Before
```tsx
  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={balance.usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })
```
## After
```tsx
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
  usdValue: number; // new property
}

  ...

	const formattedBalances = useMemo(() => {
		return balances
		...
    .map((balance: WalletBalance) => ({
        ...balance,
        formatted: balance.amount.toFixed(),
        usdValue: prices[balance.currency] * balance.amount, // memoize usdValue
      }) as FormattedWalletBalance
    );
  }, [balances, prices]);
  
  ...
  
  const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
    return (
      <WalletRow 
        className={classes.row}
        key={balance.currency} // to place index
        amount={balance.amount}
        usdValue={balance.usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })
```