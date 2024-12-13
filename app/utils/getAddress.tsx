import { createPublicClient, http } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { normalize } from 'viem/ens';

export const RESOLVER_ADDRESSES_BY_CHAIN_ID: Record<number, `0x${string}`> = {
  [baseSepolia.id]: '0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA',
  [base.id]: '0xC6d566A56A1aFf6508b41f6c90ff131615583BCD',
};

export type GetBaseAddressParams = {
  ensName: string;
  chain: typeof base | typeof baseSepolia;
};

export const getBaseAddress = async ({
  ensName,
  chain,
}: GetBaseAddressParams) => {
  const isTestnet = chain.id === baseSepolia.id;

  const testnetClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  const mainnetClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  let address = null;

  if (isTestnet) {
    try {
      address = await testnetClient.getEnsAddress({
        name: normalize(ensName),
        universalResolverAddress:
          RESOLVER_ADDRESSES_BY_CHAIN_ID[baseSepolia.id],
      });
      if (address) return address;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {}
  }

  address = await mainnetClient.getEnsAddress({
    name: normalize(ensName),
    universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[base.id],
  });

  return address;
};
