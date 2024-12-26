import { Name } from '@coinbase/onchainkit/identity';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { getThnxBalance } from '../utils/getThnxBalance';

export function Balance() {
  const { address } = useAccount();
  const [balance, setBalance] = useState<number | null>(null);
  useEffect(() => {
    async function fetchBalance() {
      const nullableBalance = await getThnxBalance({ address });
      if (nullableBalance !== null) {
        const balanceNumber = Number(nullableBalance);
        if (balanceNumber === 0) {
          setBalance(0);
        } else {
          setBalance(balanceNumber / 10 ** 18);
        }
      }
    }
    fetchBalance();
  }, [address]);

  if (balance === null) return <Name />;
  return (
    <div className="dark:text-gray-300">
      <b>Balance:</b> {balance} $THNX
    </div>
  );
}
