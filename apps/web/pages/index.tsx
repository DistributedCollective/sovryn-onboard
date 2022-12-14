import { useCallback, useEffect, useState, FC } from 'react';

import dynamic from 'next/dynamic';

import { WalletState } from '@sovryn/onboard-core';
import { Button } from '@sovryn/ui';

import { Wallet } from '../components/Wallet';
import { onboard } from '../lib/connector';

const OnboardProvider: FC<any> = dynamic(
  () => import('@sovryn/onboard-react').then(mod => mod.OnboardProvider),
  { ssr: false },
) as FC;

export default function Web() {
  const handleConnectClick = useCallback(() => {
    onboard.connectWallet();
  }, []);

  const [wallets, setWallets] = useState<WalletState[]>([]);

  useEffect(() => {
    const sub = onboard.state.select('wallets').subscribe(setWallets);
    return () => sub.unsubscribe();
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full min-h-screen self-stretch items-center justify-center">
      <h1>Connection Example</h1>

      <div>
        <Button
          onClick={handleConnectClick}
          text={wallets.length > 0 ? 'Connect another wallet' : 'Connect'}
        />
      </div>

      {wallets.length > 0 && (
        <div>
          <h2>Connected Wallets</h2>
          {wallets.map(wallet => (
            <Wallet wallet={wallet} key={wallet.accounts[0].address} />
          ))}
        </div>
      )}

      <OnboardProvider dataAttribute="onboard-demo" />
    </div>
  );
}
