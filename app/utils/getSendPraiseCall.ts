import type { ContractFunctionParameters } from 'viem';
import { BaseError, ContractFunctionRevertedError } from 'viem';

import { publicClient } from './client';
import { contractAbi } from './contractDetails';
import { contractAddress } from './contractDetails';

export async function getSendPraiseCall({
  recipient,
  amount,
  note,
  sender,
  onFeeCalculationError,
}: {
  recipient: `0x${string}`;
  amount: number;
  note: string;
  sender?: `0x${string}`;
  onFeeCalculationError: (errorString: string) => void;
}): Promise<ContractFunctionParameters[]> {
  // Reset error state
  onFeeCalculationError('');

  const amountWithDecimals: bigint = BigInt(amount * 10 ** 18);

  // useAccount can return undefined, in this case, skip the fee calculation pre-check
  // this is done to get a more user-friendly error message in case of a fee calculation error, which OnChainKit doesn't provide
  if (!!sender) {
    try {
      await publicClient.estimateContractGas({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'sendPraise',
        args: [recipient, amountWithDecimals, note],
        account: sender,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof BaseError) {
        const revertError = error.walk(
          (err) => err instanceof ContractFunctionRevertedError
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          const userFriendlyError = revertError.data?.args?.[0] ?? '';
          if (typeof userFriendlyError === 'string' && !!userFriendlyError) {
            onFeeCalculationError(userFriendlyError);
            throw userFriendlyError;
          }
        }
        onFeeCalculationError(error.shortMessage);
        throw error;
      }
      throw error;
    }
  }

  return [
    {
      address: contractAddress,
      abi: contractAbi,
      functionName: 'sendPraise',
      args: [recipient, amountWithDecimals, note],
    },
  ];
}
