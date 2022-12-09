import { TransactionResponse } from '@ethersproject/providers';

import { FC, useCallback, useEffect, useState } from 'react';

import { utils } from 'ethers';

import { Chain } from '@sovryn/onboard-common';
import type { WalletState } from '@sovryn/onboard-core/dist/types';
import { WalletIdentity } from '@sovryn/ui';

import { onboard } from '../lib/connector';
import { getSigner } from '../lib/signer';
import { ExplorerLink } from './ExplorerLink';
import styles from './Wallet.module.css';

const MESSAGE_TO_SIGN = 'hello world';

const DATA_TO_SIGN = (chainId: number) => ({
  domain: {
    chainId,
    name: 'Ether Mail',
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    version: '1',
  },

  message: {
    content: 'a signed message',
  },

  types: {
    // EIP712Domain: [
    //     { name: 'name', type: 'string' },
    //     { name: 'version', type: 'string' },
    //     { name: 'chainId', type: 'uint256' },
    //     { name: 'verifyingContract', type: 'address' },
    // ],
    Message: [{ name: 'content', type: 'string' }],
  },
});

type WalletProps = {
  wallet: WalletState;
};

export const Wallet: FC<WalletProps> = ({ wallet }) => {
  const [chainId, setChainId] = useState<string>(wallet.chains[0].id);
  const [address, setAddress] = useState<string>(wallet.accounts[0].address);

  const [tx, setTx] = useState<TransactionResponse>();

  const handlePersonalSign = useCallback(async () => {
    const signature = await getSigner(wallet.provider).signMessage(
      MESSAGE_TO_SIGN,
    );

    const signer = utils.verifyMessage(MESSAGE_TO_SIGN, signature);

    console.log({ address, signer, signature });

    alert(
      address.toLowerCase() === signer.toLowerCase()
        ? 'Signature verified'
        : 'Signature verification failed',
    );
  }, [address, wallet.provider]);

  const handleDataSign = useCallback(async () => {
    const data = DATA_TO_SIGN(parseInt(chainId));

    const signature = await getSigner(wallet.provider)._signTypedData(
      data.domain,
      data.types,
      data.message,
    );

    const signer = utils.verifyTypedData(
      data.domain,
      data.types,
      data.message,
      signature,
    );

    console.log({ address, signer, signature });

    alert(
      address.toLowerCase() === signer.toLowerCase()
        ? 'Signature verified'
        : 'Signature verification failed',
    );
  }, [address, chainId, wallet.provider]);

  const sendTransaction = useCallback(async () => {
    try {
      const tx = await getSigner(wallet.provider).sendTransaction({
        to: address,
        value: 0,
      });

      setTx(tx);

      const wait = await tx.wait();

      setTx(value => ({
        ...(value as TransactionResponse),
        confirmations: wait.confirmations,
      }));

      console.log({ tx });
    } catch (error) {
      console.error(error);
      setTx(undefined);
    }
  }, [address, wallet.provider]);

  const switchNetwork = useCallback(
    (chain: Chain) => async () => {
      const result = await onboard.setChain({
        chainId: chain.id,
        wallet: wallet.label,
      });
      console.log(result);
    },
    [wallet.label],
  );

  const disconnect = useCallback(async () => {
    await onboard.disconnectWallet(wallet.label);
  }, [wallet.label]);

  useEffect(() => {
    wallet.provider.on('chainChanged', value => {
      console.log('chainged chainId to ', value, Number(value));
      setChainId(value);
    });

    wallet.provider.on('accountsChanged', value => {
      console.log('account changed to ', value);
      setAddress(value[0]);
    });
  }, [wallet.provider]);

  return (
    <div key={wallet.label} className={styles.container}>
      <div>
        <WalletIdentity
          address={address}
          onDisconnect={disconnect}
          submenuLabels={{
            copyAddress: 'Copy Address',
            disconnect: 'Disconnect',
          }}
        />
      </div>
      <h3 className={styles.label}>
        {wallet.label}{' '}
        <em className={styles.sublabel}>[chainId: {Number(chainId)}]</em>
      </h3>
      <div>
        <ol className="list-disc list-inside">
          <li>
            <button onClick={handlePersonalSign} className={styles.button}>
              Sign Personal Message
            </button>
          </li>

          <li>
            <button onClick={handleDataSign} className={styles.button}>
              Sign Typed Data
            </button>
          </li>
        </ol>

        <hr />

        <ol className="list-disc list-inside">
          <li>
            <button onClick={sendTransaction} className={styles.button}>
              Send Transaction
            </button>
          </li>
          {tx && (
            <li>
              <ExplorerLink tx={tx} />
            </li>
          )}
        </ol>
        <hr />
        <ol className="list-disc list-inside">
          {onboard.state.get().chains.map(chain => (
            <li>
              <button
                onClick={switchNetwork(chain)}
                className={styles.button}
                key={chain.id}
              >
                Switch to {chain.label} {chainId === chain.id && ' [current]'}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
