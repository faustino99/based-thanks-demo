import { Badge } from '@coinbase/onchainkit/identity';
import { useCallback, useState } from 'react';
import { isAddress } from 'viem';
import { baseSepolia } from 'viem/chains';

import { getBaseAddress } from '../utils/getAddress';

type RecipientFieldProps = {
  onBlur: (address: `0x${string}` | null) => void;
};

export function RecipientField({ onBlur }: RecipientFieldProps) {
  const [recipient, setRecipient] = useState('');
  const [hasValidationError, setHasValidationError] = useState(false);
  const [hasVerifiedAddress, setHasVerifiedAddress] = useState(false);
  const handleBlur = useCallback(async () => {
    setHasValidationError(false);

    if (!recipient) {
      return;
    }
    if (recipient.endsWith('.eth')) {
      const address = await getBaseAddress({
        ensName: recipient,
        chain: baseSepolia,
      });
      if (address) {
        setHasVerifiedAddress(true);
        onBlur(address);
      } else {
        setHasValidationError(true);
      }
    } else if (isAddress(recipient)) {
      setHasVerifiedAddress(true);
      onBlur(recipient);
    } else {
      setHasValidationError(true);
    }
  }, [recipient, onBlur]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <div className="flex w-full flex-col gap-2">
          <label className="whitespace-nowrap text-lg font-bold text-gray-700 dark:text-gray-200">
            Who are you giving thanks to?
          </label>
          <div>
            <input
              type="text"
              id="recipient"
              className="w-full rounded-xl border px-5 py-4 text-xl transition-colors placeholder:text-xl focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400"
              placeholder="ex: barmstrong.base.eth, 0x1234..6789"
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
                setHasVerifiedAddress(false);
              }}
              onFocus={() => setHasValidationError(false)}
              onBlur={() => handleBlur()}
            />
          </div>
          {hasVerifiedAddress ? (
            <div className="flex items-center gap-1.5">
              <Badge className="!h-4 !max-h-4 !w-4 !max-w-4 bg-green-700" />
              <p className="text-sm text-green-700">Verified</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Wallet address or{' '}
              <a
                href="https://www.base.org/names"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Basename
              </a>
            </p>
          )}
          {hasValidationError && (
            <p className="text-sm text-red-800">
              Invalid recipient address or ENS name.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
