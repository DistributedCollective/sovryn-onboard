import { EthereumProviderOptions } from '@walletconnect/ethereum-provider/dist/types/EthereumProvider';

import type { WalletInit } from '@sovryn/onboard-common';

import v1 from './v1';
import v2 from './v2';

export type WalletConnectOptions = {
  handleUri?: (uri: string) => Promise<unknown>;
  connectFirstChainId?: boolean;
  bridge?: string;
  qrcodeModalOptions?: {
    mobileLinks: string[];
  };
} & (
  | {
      version?: 1;
    }
  | {
      projectId: string;
      version: 2;
      requiredChains?: number[] | undefined;
      qrModalOptions?: EthereumProviderOptions['qrModalOptions'];
    }
);

export const isHexString = (value: string | number) => {
  if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }

  return true;
};

function walletConnect(options?: WalletConnectOptions): WalletInit {
  const version = (options && options.version) || 1;
  return version === 1 ? v1(options) : v2(options);
}

export default walletConnect;
