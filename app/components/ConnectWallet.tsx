import {
  Address,
  Avatar,
  EthBalance,
  Identity,
  Name,
} from '@coinbase/onchainkit/identity';
import {
  ConnectWallet,
  ConnectWalletText,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownDisconnect,
  WalletDropdownLink,
} from '@coinbase/onchainkit/wallet';
import { useContext } from 'react';

import { SmartWalletOnlyContext } from '../providers';

import { Balance } from './BalanceOrName';

export function ConnectWalletButton() {
  const { smartWalletOnly } = useContext(SmartWalletOnlyContext);
  return (
    <Wallet>
      <ConnectWallet>
        <ConnectWalletText>
          Connect {smartWalletOnly ? 'Smart' : ''} Wallet
        </ConnectWalletText>
        <Avatar className="h-6 w-6" />
        <Balance />
      </ConnectWallet>
      <WalletDropdown>
        <Identity className="px-4 pb-2 pt-3" hasCopyAddressOnClick>
          <Avatar />
          <Name />
          <Address />
          <EthBalance />
        </Identity>
        <WalletDropdownBasename />
        <WalletDropdownLink
          icon="wallet"
          href="https://keys.coinbase.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wallet
        </WalletDropdownLink>
        <WalletDropdownDisconnect />
      </WalletDropdown>
    </Wallet>
  );
}
