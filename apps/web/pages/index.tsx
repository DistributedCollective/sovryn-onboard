import {
  ConnectProvider,
  UnisatConnector,
  OKXConnector,
  XverseConnector,
  BybitConnector,
} from '@particle-network/btc-connectkit';
import { BOBTestnet } from '@particle-network/chains';

import { useCallback, useEffect, useState, FC } from 'react';

import dynamic from 'next/dynamic';
import { skip } from 'rxjs/operators';

import { WalletState } from '@sovryn/onboard-core';
import { Button } from '@sovryn/ui';

import { Wallet } from '../components/Wallet';
import { onboard } from '../lib/connector';
import BTCConnect from '../components/BTCConnect';

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

      <div className="flex items-center gap-2">
        <Button onClick={() => onboard.changeLanguage('en')} text="EN" />
        <Button onClick={() => onboard.changeLanguage('es')} text="ES" />
        <Button
          onClick={() => onboard.changeLanguage('custom')}
          text="Custom"
        />
      </div>
      <ConnectProvider
        options={{
          projectId: 'cb827d8b-a1af-4d46-98a7-e922ba68fe91', // this is a test project id
          clientKey: 'cGEPcgHNFQ7Eb9HIkXVnjSxSlL793qTSH3i0iQzb', // this is a test key
          appId: 'sibYxrpDDpKPtq5jZDq696rkVWeV8ITCZbM3KAbX', // this is a test app id
          aaOptions: {
            accountContracts: {
              BTC: [
                {
                  chainIds: [BOBTestnet.id],
                  version: '2.0.0',
                },
              ],
            },
          },
          walletOptions: {
            visible: true,
          },
        }}
        connectors={[
          new UnisatConnector(),
          new OKXConnector(),
          new XverseConnector(),
          new BybitConnector(),
        ]}
      >
        <BTCConnect />
      </ConnectProvider>
      <OnboardProvider dataAttribute="onboard-demo" />
    </div>
  );
}
