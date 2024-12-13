import { publicClient } from './client';
import { contractAddress, eventAbi } from './contractDetails';

export async function fetchLogs({
  blockLookbackWindow,
}: {
  blockLookbackWindow: number;
}) {
  const currentBlock = await publicClient.getBlockNumber();
  const fromBlock = Number(currentBlock) - blockLookbackWindow;

  try {
    const logs = await publicClient.getLogs({
      address: contractAddress,
      event: eventAbi,
      fromBlock: BigInt(fromBlock),
      toBlock: 'latest',
    });
    return logs;
  } catch (error) {
    console.error('Error fetching logs:', error);
  }
}
