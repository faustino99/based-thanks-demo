'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { base } from 'viem/chains';
import { baseSepolia } from 'viem/chains';

import { getEnsName } from '../utils/getEnsName';
import { sliceAddress } from '../utils/sliceAddress';

type CustomNameProps = {
  address: `0x${string}`;
  chain?: typeof base | typeof baseSepolia;
  className?: string;
};

export function CustomName({
  address,
  chain = baseSepolia,
  className = '',
}: CustomNameProps) {
  const { data: name, isLoading } = useQuery({
    queryKey: ['ensName', address, chain.id],
    queryFn: async () => await getEnsName({ address, chain }),
  });
  const [copied, setCopied] = useState(false);

  const slicedAddress = sliceAddress(address);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex w-56 min-w-56 flex-col whitespace-nowrap px-2 py-4 text-sm ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="inline-block max-w-[215px] cursor-text select-all truncate p-0 font-bold dark:text-white">
          {isLoading ? 'Loading...' : name}
        </span>
        <button
          onClick={copyToClipboard}
          className="hover:text-gray-600 dark:hover:text-gray-300"
          title="Copy address"
        >
          {copied ? (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
        </button>
      </div>
      {name !== slicedAddress ? (
        <div className="flex items-center gap-2">
          <span className="font-normal text-gray-500 dark:text-gray-400">
            {slicedAddress}
          </span>
        </div>
      ) : null}
    </div>
  );
}
