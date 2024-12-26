'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { baseSepolia } from 'viem/chains';

import { CustomName } from '../components/CustomName';
import { TransactionCountDropdown } from '../components/TransactionCountDropdown';
import { getBaseAddress } from '../utils/getAddress';
import { fetchPraiseLogs } from '../utils/graphql';

export default function ViewThanks() {
  const [searchQuery, setSearchQuery] = useState('');
  const [finalSearchQuery, setFinalSearchQuery] = useState('');
  const [transactionCount, setTransactionCount] = useState<number>(5);
  const [finalTransactionCount, setFinalTransactionCount] = useState<number>(5);

  const { data: praiseEvents = [], isError } = useQuery({
    queryKey: ['praiseLogs', finalSearchQuery],
    queryFn: async () => {
      const praiseSents = await fetchPraiseLogs({
        address: finalSearchQuery,
      });
      if (!finalSearchQuery) return praiseSents;

      return praiseSents;
    },
  });

  const handleBlur = async () => {
    if (searchQuery.endsWith('.eth')) {
      getBaseAddress({
        ensName: searchQuery,
        chain: baseSepolia,
      }).then((address) => {
        if (address) {
          setFinalSearchQuery(address);
        } else {
          setFinalSearchQuery(searchQuery);
        }
      });
    } else {
      setFinalSearchQuery(searchQuery);
    }
    setFinalTransactionCount(transactionCount);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-4 dark:bg-background">
      <main className="mx-auto w-full max-w-6xl py-8">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Past Gratitude
          </h1>

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Search address
              </label>
              <input
                type="text"
                id="search"
                className="w-96 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
                placeholder="Wallet address or full Basename..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleBlur();
                  }
                }}
              />
            </div>

            <div className="mt-4">
              <TransactionCountDropdown
                count={transactionCount}
                setCount={setTransactionCount}
              />
            </div>
            <button
              className="mb-4 w-36 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700"
              onClick={handleBlur}
            >
              Search
            </button>
          </div>

          <div className="flex w-fit flex-col overflow-auto rounded-lg border border-gray-200 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex w-fit bg-gray-50 dark:bg-gray-800">
              <div className="w-48 min-w-48 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Date
              </div>
              <div className="w-56 min-w-56 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                From
              </div>
              <div className="w-56 min-w-56 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                To
              </div>
              <div className="w-48 min-w-48 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Amount
              </div>
              <div className="min-w-48 px-2 py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Note
              </div>
            </div>

            <div className="divide-y bg-white dark:divide-gray-700 dark:bg-gray-900">
              {praiseEvents
                .slice(0, finalTransactionCount)
                .map(
                  ({ timestamp, sender, recipient, amount, note }, index) => {
                    return (
                      <div
                        key={index}
                        className="flex w-fit border-t hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                      >
                        <div className="w-48 min-w-48 whitespace-nowrap px-2 py-4 text-sm text-gray-900 dark:text-gray-300">
                          {timestamp
                            ? new Date(Number(timestamp) * 1000).toLocaleString(
                                undefined,
                                {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  day: 'numeric',
                                  month: 'numeric',
                                  year: '2-digit',
                                }
                              )
                            : '-'}
                        </div>
                        <CustomName
                          address={sender as `0x${string}`}
                          className="inline-block max-w-[215px] truncate p-0 font-bold dark:text-white"
                        />
                        <CustomName
                          address={recipient as `0x${string}`}
                          className="inline-block max-w-[215px] truncate p-0 font-bold dark:text-white"
                        />
                        <div className="w-48 min-w-48 whitespace-nowrap px-2 py-4 text-sm text-gray-900 dark:text-gray-300">
                          {amount ? Number(amount) / 10 ** 18 : '-'} $THNX
                        </div>
                        <div className="w-48 min-w-48 break-words px-2 py-4 pr-4 text-sm text-gray-900 dark:text-gray-300">
                          {note || '-'}
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
            {/* </div> */}
            {/* </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}
