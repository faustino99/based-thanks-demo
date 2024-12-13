import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

// Used for public client stuff
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});
