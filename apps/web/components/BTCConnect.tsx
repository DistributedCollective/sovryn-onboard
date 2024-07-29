import {
  useETHProvider,
  useBTCProvider,
  useConnectModal,
} from '@particle-network/btc-connectkit';

import React, { useCallback, useEffect, useState } from 'react';

import { Button, WalletIdentity } from '@sovryn/ui';

const BTCConnect = () => {
  const { account } = useETHProvider();
  const { openConnectModal, disconnect } = useConnectModal();
  const { accounts, sendBitcoin, getNetwork } = useBTCProvider();
  const [balanceBtc, setBalanceBtc] = useState('');

  useEffect(() => {
    if (!account || accounts.length === 0) {
      return;
    }

    const fetchBalances = async () => {
      try {
        const networkSuffix =
          (await getNetwork()) === 'livenet' ? 'main' : 'test3';
        const response = await fetch(
          `https://api.blockcypher.com/v1/btc/${networkSuffix}/addrs/${accounts[0]}/balance`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch BTC balance');
        }

        const data = await response.json();
        setBalanceBtc((data.balance / 1e8).toFixed(8));
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    };

    fetchBalances();
  }, [account, accounts, getNetwork]);

  const executeTxBtc = useCallback(async () => {
    try {
      const hash = await sendBitcoin(accounts[0], 1);
      alert(`Transaction mined: ${hash}`);
    } catch (error) {
      console.error('Error executing BTC transaction:', error);
    }
  }, [accounts, sendBitcoin]);

  return !account ? (
    <Button onClick={openConnectModal} text="Connect to BTC Wallet" />
  ) : (
    <div>
      <h1>Connected</h1>
      <div className="flex justify-around items-center">
        <h2>BTC Wallet</h2>
        <WalletIdentity
          address={accounts[0]}
          onDisconnect={disconnect}
          submenuLabels={{
            copyAddress: 'Copy Address',
            disconnect: 'Disconnect',
          }}
          className="ml-4"
        />
      </div>
      <h2>Balance: {balanceBtc} BTC</h2>
      <div className="flex justify-around">
        <Button onClick={executeTxBtc} text="Execute BTC Transaction" />
      </div>
    </div>
  );
};

export default BTCConnect;
