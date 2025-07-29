# 1. getPriority
- is redefined every render → bring out of `WalletPage`
- uses clunky `switch case` → replace with `Record` dictionary (easier for future API integration)
- `-99` is a magic number and referenced twice → assign to a constant

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
const PRIORITY_DB: Record<string, number> = {
  'Osmosis': 100,
  'Ethereum': 50,
  'Arbitrum': 30,
  'Zilliqa': 20,
  'Neo': 20
}

const getPriority = (blockchain: string): number => {
  return PRIORITY_DB[blockchain] || NO_PRIORITY;
};
```

# 2. sortedBalances & formattedBalances
- `lhsPriority` was never declared before, typo from `balancePriority`
- `balance.amount <= 0` returns only negative balances → flip to `balance.amount > 0` to display positive balances
- nested if statements inside `filter()` can be simplified into an one-liner expression
- sorting in descending order → can be written as `rightPriority - leftPriority` instead of using verbose `if else` statements
- `formattedBalances` is unused and should be chained after `.map`

## Before
```tsx
	const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      if (lhsPriority > -99) { // lhsPriority should be balancePriority
        if (balance.amount <= 0) { // filtering out positive balances?
          return true; // nestd if statements can be simplified
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

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => { // doesn't use formattedBalances
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

# 3. WalletRows
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
```

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
        formatted: balance.amount.toFixed(),
        usdValue: prices[balance.currency] * balance.amount, // memoize usdValue
      }) as FormattedWalletBalance
    );
  }, [balances, prices]);
```

```tsx
  const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
    return (
      <WalletRow 
        className={classes.row}
        key={`${balance.blockchain}-${balance.currency}`} // new key
        amount={balance.amount}
        usdValue={balance.usdValue} // use memoized usdValue
        formattedAmount={balance.formatted}
      />
    )
  })
```