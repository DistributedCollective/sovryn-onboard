import { useCallback, useEffect, useState, FC } from 'react';

import dynamic from 'next/dynamic';
import { skip } from 'rxjs/operators';

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
    const sub = onboard.state
      .select('wallets')
      .pipe(skip(1))
      .subscribe(items => {
        setWallets(items);

        if (items.length > 0) {
          const wallet = items[0];
          localStorage.setItem('onboard.selectedWallet', wallet.label);
        } else {
          localStorage.removeItem('onboard.selectedWallet');
        }
      });

    const selected = localStorage.getItem('onboard.selectedWallet');
    if (selected) {
      onboard.connectWallet(selected);
    }

    return () => sub.unsubscribe();
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full min-h-screen self-stretch items-center justify-center">
      <h1>Connection Example</h1>

      <div className="flex flex-col gap-4 justify-between items-center">
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

      <Button
        onClick={() => onboard.changeLanguage('es')}
        text="Change to es"
      />

      <OnboardProvider dataAttribute="onboard-demo" />
    </div>
  );
}
