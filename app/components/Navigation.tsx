'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ConnectWalletButton } from './ConnectWallet';
import { SmartWalletToggle } from './SmartWalletToggle';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-background">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-28 items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.jpg"
                alt="Based Thanks Logo"
                className="h-14 w-14 rounded-full"
              />
              <div className="flex hidden items-center md:block">
                <span className="text-2xl font-bold text-gray-200">Based</span>
                <span className="text-2xl font-bold text-blue-500">Thanks</span>
              </div>
            </div>
            <div className="ml-8 flex gap-4">
              <Link
                href="/give-thanks"
                className={`inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 ${
                  ['/give-thanks', '/'].includes(pathname) ? 'font-bold' : ''
                }`}
              >
                Give Thanks
              </Link>
              <Link
                href="/view-thanks"
                className={`inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 ${
                  pathname === '/view-thanks' ? 'font-bold' : ''
                }`}
              >
                View Thanks
              </Link>
            </div>
          </div>

          <div className="flex hidden items-center sm:block">
            <div className="wallet-container flex flex-col items-end gap-3">
              <ConnectWalletButton />
              <SmartWalletToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
