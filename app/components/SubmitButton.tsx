import { Avatar, Name } from '@coinbase/onchainkit/identity';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import {
  ConnectWallet,
  ConnectWalletText,
  Wallet,
} from '@coinbase/onchainkit/wallet';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

import { getSendPraiseCall } from '../utils/getSendPraiseCall';

type SubmitButtonProps = {
  recipientAddress: `0x${string}` | null;
  amount: number | undefined;
  note: string;
  confirmed: boolean;
};

export function SubmitButton({
  recipientAddress,
  amount,
  note,
  confirmed,
}: SubmitButtonProps) {
  const { isConnected, address } = useAccount();
  const router = useRouter();

  const [transactionError, setTransactionError] = useState('');

  const isSubmittable = useMemo(
    () => !!recipientAddress && !!amount && !!note && confirmed,
    [recipientAddress, amount, note, confirmed]
  );

  const getSendPraiseCallOnSubmit = useCallback(async () => {
    if (isSubmittable && recipientAddress && amount) {
      const calls = await getSendPraiseCall({
        recipient: recipientAddress,
        amount: amount ?? 0,
        note: note,
        onFeeCalculationError: setTransactionError,
        sender: address,
      });
      return calls;
    }
    throw new Error('Not submittable');
  }, [recipientAddress, amount, note, address, isSubmittable]);

  return (
    <>
      {isConnected ? (
        <>
          <Transaction
            chainId={baseSepolia.id}
            calls={getSendPraiseCallOnSubmit}
            isSponsored
          >
            <TransactionButton
              text="Give thanks"
              disabled={!isSubmittable}
              successOverride={{
                text: 'View praise',
                onClick: () => {
                  router.push('/view-thanks');
                },
              }}
            />
            <TransactionStatus>
              {transactionError ? (
                <p className="text-sm text-red-800">{transactionError}</p>
              ) : (
                <TransactionStatusLabel />
              )}
              <TransactionStatusAction />
            </TransactionStatus>
          </Transaction>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <Wallet className="w-full">
            <ConnectWallet className="w-full">
              <ConnectWalletText>
                Connect wallet to give thanks
              </ConnectWalletText>
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
          </Wallet>
          <p className="text-sm text-gray-500">
            Connect a smart wallet for <b className="text-green-900">zero</b>{' '}
            transaction fees
          </p>
        </div>
      )}
    </>
  );
}
