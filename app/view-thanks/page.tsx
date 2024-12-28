'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { baseSepolia } from 'viem/chains';

import { CustomName } from '../components/CustomName';
import { getBaseAddress } from '../utils/getAddress';
import { fetchPraiseLogs } from '../utils/graphql';

function ViewThanksContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [finalSearchQuery, setFinalSearchQuery] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearchQuery = async (query: string) => {
    setSearchError(null);
    if (query.endsWith('.eth')) {
      const address = await getBaseAddress({
        ensName: query,
        chain: baseSepolia,
      });
      if (!address) {
        setSearchError('Basename not found. Try a different query');
        return;
      }
      setFinalSearchQuery(address);
    } else {
      setFinalSearchQuery(query);
    }
  };

  const handleBlur = () => handleSearchQuery(searchQuery);

  const handleClear = () => {
    setSearchQuery('');
    setFinalSearchQuery('');
    setSearchError(null);
  };

  // Set initial finalSearchQuery from URL parameter
  useEffect(() => {
    const queryParam = searchParams.get('query');
    if (queryParam) {
      setSearchQuery(queryParam);
      handleSearchQuery(queryParam);
    }
  }, [searchParams]);

  const {
    data: praiseEvents = [],
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['praiseLogs', finalSearchQuery],
    queryFn: async () => {
      const praiseSents = await fetchPraiseLogs({
        address: finalSearchQuery,
      });
      if (!finalSearchQuery) return praiseSents;

      return praiseSents;
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-4 dark:bg-background">
      <main className="mx-auto w-full max-w-6xl py-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Past Gratitude
            </h1>
            <button
              onClick={() => refetch()}
              className="rounded-lg bg-transparent p-2 text-gray-700 hover:bg-gray-50 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label="Refresh"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Filter by
              </label>
              <div className="flex flex-col gap-1">
                <div className="relative w-[500px]">
                  <input
                    type="text"
                    id="search"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
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
                  {searchQuery && (
                    <button
                      onClick={handleClear}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                      aria-label="Clear search"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                {searchError && (
                  <p className="text-sm text-red-600 dark:text-red-800">
                    {searchError}
                  </p>
                )}
              </div>
            </div>
            {isError && (
              <p className="text-sm text-red-800">
                An unexpected error occurred fetching praise logs.{' '}
                <button
                  onClick={() => refetch()}
                  className="text-blue-500 hover:text-blue-900 hover:underline"
                >
                  Try again
                </button>
              </p>
            )}
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

            <div className="max-h-[500px] divide-y bg-white dark:divide-gray-700 dark:bg-gray-900">
              {isLoading ? (
                <div className="flex w-full items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400"></div>
                  <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                    Fetching past events...
                  </span>
                </div>
              ) : (
                praiseEvents.map(
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
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ViewThanks() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewThanksContent />
    </Suspense>
  );
}
