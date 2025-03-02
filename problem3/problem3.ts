/*
Inefficiencies and anti-patterns:
    
    - 'getPriority' is called multiple times in the 'useMemo' hook. This is inefficient and could be optimized by calculate the priority once and store it in a variable.
    - The condition 'lhsPriority > -99' should be 'balancePriority > -99' and the logic seems to be inverted
    - The sort function does not handle the case when priorities are equal. This could cause inconsistent ordering of items with the same priority.
    - The 'children' prop is destructured but never used in the component.
    - Using 'index' as key lead to issues with component state and performance
    - formattedBalances array is created not used. This leads to unnecessary memory allocation.


Suggestions for improvement:
   - The getPriority function called once for each balance when creating balancesWithPriority. This avoids multiple calls and improves efficiency.
   - The filtering condition checks balance.priority > -99 and balance.amount > 0, ensuring that only valid balances are included.
   - The sorting function  handles cases where priorities are equal by adding a secondary sort based on the currency using localeCompare. For ensures consistent ordering.
   - The formatted property is calculated in the same pass as filtering and sorting, ensuring that the formatted amounts are created only for the relevant balances.
   - The keys for the WalletRow components are unique, combining currency and blockchain, which helps React optimize rendering and avoids potential issues with state.
*/

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Added blockchain to WalletBalance
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}


const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props; 

  const balances: WalletBalance[] = useWalletBalances(); 
  const prices: Record<string, number> = usePrices(); 

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
        return 20;
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    // Calculate priorities once for each balance
    const balancesWithPriority = balances.map((balance) => ({
      ...balance,
      priority: getPriority(balance.blockchain),
    }));

    return balancesWithPriority
      .filter((balance) => balance.priority > -99 && balance.amount > 0) // Corrected condition
      .sort((lhs, rhs) => {
        const priorityDifference = rhs.priority - lhs.priority; // Sort by priority
        if (priorityDifference !== 0) {
          return priorityDifference; // Sort by priority
        }
        return lhs.currency.localeCompare(rhs.currency); // Secondary sort by currency
      })
      .map((balance) => ({
        ...balance,
        formatted: balance.amount.toFixed(2), // Specify decimal places
      }));
  }, [balances, prices]);

  const rows = sortedBalances.map((balance: FormattedWalletBalance) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className="row" 
        key={`${balance.currency}-${balance.blockchain}`} // Use unique key
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};

export default WalletPage;