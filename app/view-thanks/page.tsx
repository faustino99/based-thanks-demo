'use client';

import { Identity, Name } from '@coinbase/onchainkit/identity';
import { useEffect, useState } from 'react';
import { baseSepolia } from 'viem/chains';

import { getBaseAddress } from '../utils/getAddress';
import { fetchLogs } from '../utils/getPraiseLogs';

type PraiseEvent = {
  sender?: `0x${string}` | undefined;
  recipient?: `0x${string}` | undefined;
  amount?: bigint | undefined;
  note?: string | undefined;
  timestamp?: bigint | undefined;
};

export default function ViewThanks() {
  const [praiseEvents, setPraiseEvents] = useState<PraiseEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [finalSearchQuery, setFinalSearchQuery] = useState('');
  const [blockLookbackWindow, setBlockLookbackWindow] =
    useState<string>('10000');

  useEffect(() => {
    async function fetchLogsAsync() {
      if (Number(blockLookbackWindow) > 0) {
        const logs = await fetchLogs({
          blockLookbackWindow: Number(blockLookbackWindow),
        });
        const events = logs?.map((log) => log.args);
        if (events) {
          setPraiseEvents(events);
        }
      }
    }
    fetchLogsAsync();
  }, [blockLookbackWindow]);

  const filteredEvents = praiseEvents
    .filter(
      (event) =>
        event.sender?.toLowerCase().includes(finalSearchQuery.toLowerCase()) ||
        event.recipient?.toLowerCase().includes(finalSearchQuery.toLowerCase())
    )
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

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
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-4 dark:bg-background">
      <main className="mx-auto w-full max-w-6xl py-8">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Contract Events
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
                placeholder="Enter the wallet address or full Basename..."
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
              <label
                htmlFor="blockLookback"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Block lookback window (avg block time ~2 seconds)
              </label>
              <input
                id="blockLookback"
                className={`mb-1 mt-2 w-96 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 ${
                  Number(blockLookbackWindow) > 0 ? '' : 'dark:text-red-800'
                }`}
                placeholder="Enter number of blocks to look back..."
                value={blockLookbackWindow}
                onChange={(e) => {
                  setBlockLookbackWindow(e.target.value);
                }}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Note: large lookback windows may cause the request to fail.
              </p>
            </div>
          </div>

          <div className="flex flex-col divide-y overflow-hidden rounded-lg border border-gray-200 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-900">
            <div className="overflow-auto">
              <div className="min-w-6xl">
                <div className="bg-gray-50 dark:bg-gray-800">
                  <div className="flex gap-2">
                    <div className="w-48 min-w-48 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Date
                    </div>
                    <div className="w-48 min-w-48 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      From
                    </div>
                    <div className="w-48 min-w-48 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      To
                    </div>
                    <div className="w-48 min-w-48 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Amount
                    </div>
                    <div className="min-w-48 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Note
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  {filteredEvents.map((event, index) => (
                    <div
                      key={index}
                      className="flex gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="w-48 min-w-48 whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                        {event.timestamp
                          ? new Date(
                              Number(event.timestamp) * 1000
                            ).toLocaleString(undefined, {
                              hour: '2-digit',
                              minute: '2-digit',
                              day: 'numeric',
                              month: 'numeric',
                              year: '2-digit',
                            })
                          : '-'}
                      </div>
                      <div className="w-48 min-w-48 whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                        <Identity
                          address={event.sender}
                          className="m-0 items-start bg-transparent p-0"
                        >
                          <Name className="-ml-3 inline-block max-w-[160px] truncate p-0" />
                        </Identity>
                      </div>
                      <div className="w-48 min-w-48 whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                        <Identity
                          address={event.recipient}
                          className="m-0 items-start bg-transparent p-0"
                        >
                          <Name className="-ml-3 inline-block max-w-[160px] truncate p-0" />
                        </Identity>
                      </div>
                      <div className="w-48 min-w-48 whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                        {event.amount ? Number(event.amount) / 10 ** 18 : '-'}{' '}
                        $THNX
                      </div>
                      <div className="min-w-48 break-words px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                        {event.note || '-'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
