import { useContext } from 'react';
import { useAccount } from 'wagmi';

import { SmartWalletOnlyContext } from '../providers';

export function SmartWalletToggle() {
  const { isConnected } = useAccount();
  const { setSmartWalletOnly, smartWalletOnly } = useContext(
    SmartWalletOnlyContext
  );

  if (isConnected) return null;
  return (
    <div className="flex items-center justify-center gap-2">
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={smartWalletOnly}
          onChange={(e) => setSmartWalletOnly(e.target.checked)}
        />
        <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700"></div>
        <p className="font-md ml-2 overflow-ellipsis whitespace-nowrap text-xs dark:text-gray-500">
          <b className="text-xs font-bold text-green-700">No fees</b> (Smart
          wallet only)
        </p>
      </label>
    </div>
  );
}
