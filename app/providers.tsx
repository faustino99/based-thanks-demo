'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { type ReactNode, createContext, useContext, useState } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export const SmartWalletOnlyContext = createContext<{
  smartWalletOnly: boolean;
  setSmartWalletOnly: (smartWalletOnly: boolean) => void;
}>({
  smartWalletOnly: false,
  setSmartWalletOnly: () => {},
});

const defaultQueryClient = new QueryClient();

export function SmartWalletOnlyProvider({ children }: { children: ReactNode }) {
  const [smartWalletOnly, setSmartWalletOnly] = useState(false);

  return (
    <SmartWalletOnlyContext.Provider
      value={{ smartWalletOnly, setSmartWalletOnly }}
    >
      {children}
    </SmartWalletOnlyContext.Provider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const { smartWalletOnly } = useContext(SmartWalletOnlyContext);

  return (
    <WagmiProvider
      config={createConfig({
        chains: [baseSepolia],
        connectors: [
          coinbaseWallet({
            appName: 'Based Thanks',
            preference: smartWalletOnly ? 'smartWalletOnly' : 'all',
          }),
        ],
        ssr: true,
        transports: {
          [baseSepolia.id]: http(),
        },
      })}
    >
      <QueryClientProvider client={defaultQueryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={baseSepolia}
          config={{
            appearance: {
              mode: 'auto',
            },
            paymaster: `https://api.developer.coinbase.com/rpc/v1/base-sepolia/${process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}`,
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
