import { getName } from '@coinbase/onchainkit/identity';
import { baseSepolia, base } from 'viem/chains';

import { sliceAddress } from './sliceAddress';

// Add cache object
const ensCache: Record<string, string> = {};

type GetBaseEnsParams = {
  address: `0x${string}`;
  chain: typeof base | typeof baseSepolia;
};

export const getEnsName = async ({ address, chain }: GetBaseEnsParams) => {
  // Create cache key using address and chain ID
  const cacheKey = `${address}-${chain.id}`;

  // Check cache first
  if (ensCache[cacheKey] !== undefined) {
    return ensCache[cacheKey];
  }

  const isTestnet = chain.id === baseSepolia.id;

  let ensName: string | undefined;

  if (isTestnet) {
    try {
      const testnetBasename = await getName({ address, chain: baseSepolia });
      if (testnetBasename) {
        ensName = testnetBasename;
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (!ensName) {
    try {
      const baseName = await getName({ address, chain: base });
      if (baseName) {
        ensName = baseName;
      }
    } catch (error) {
      console.error(error);
    }
  }

  // fallback to address if no ens name is found
  ensName = ensName ?? sliceAddress(address);

  // Store result in cache
  ensCache[cacheKey] = ensName;

  return ensName;
};
