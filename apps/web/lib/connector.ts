import Onboard from '@sovryn/onboard-core';
import { Asset, BasePath } from '@sovryn/onboard-hw-common';
import injectedModule from '@sovryn/onboard-injected';
import ledgerModule from '@sovryn/onboard-ledger';
import trezorModule from '@sovryn/onboard-trezor';
import walletConnectModule from '@sovryn/onboard-walletconnect';

const basePaths: BasePath[] = [
  { label: 'RSK Mainnet', value: "m/44'/137'/0'/0" },
  { label: 'Ethereum Mainnet', value: "m/44'/60'/0'/0" },
];
const assets: Asset[] = [{ label: 'RBTC' }, { label: 'ETH' }];

const injected = injectedModule();
const ledger = ledgerModule({
  basePaths,
  assets,
});
const trezor = trezorModule({
  email: 'victor@sovryn.app',
  appUrl: 'https://sovryn.app',
  basePaths,
  assets,
});
// const walletConnectV1 = walletConnectModule({ version: 1 });
const walletConnectV2 = walletConnectModule({
  version: 2,
  projectId: 'd3483196fbaa8259ab4191347c67f973',
});
export const onboard = Onboard({
  wallets: [injected, ledger, trezor, walletConnectV2],
  chains: [
    {
      id: '0x1e',
      rpcUrl: 'https://public-node.rsk.co',
      label: 'RSK',
      token: 'RBTC',
      blockExplorerUrl: 'https://explorer.rsk.co',
    },
    {
      id: '0x1',
      rpcUrl: 'https://cloudflare-eth.com/v1/mainnet',
      label: 'Ethereum Mainnet',
      token: 'ETH',
      blockExplorerUrl: 'https://etherscan.io',
    },
    {
      id: '0x1f',
      rpcUrl: 'https://public-node.testnet.rsk.co',
      label: 'RSK testnet',
      token: 'tRBTC',
      blockExplorerUrl: 'https://explorer.testnet.rsk.co',
    },
  ],
  i18n: {
    en: {
      wallets: {
        connectWallet: 'Connect Wallet EN',
      },
    },
    es: {
      wallets: {
        connectWallet: 'Connect Wallet ES',
      },
    },
    custom: {
      wallets: {
        connectWallet: 'Custom',
      },
    },
  },
});
