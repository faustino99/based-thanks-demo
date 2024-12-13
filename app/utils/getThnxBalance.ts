import { publicClient } from './client';
import { contractAddress } from './contractDetails';
import { contractAbi } from './contractDetails';

export async function getThnxBalance({ address }: { address?: `0x${string}` }) {
  if (!address) return null;
  const balance = await publicClient.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'balanceOf',
    args: [address],
  });
  return balance;
}
