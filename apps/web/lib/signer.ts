import { providers } from 'ethers';

import type { EIP1193Provider } from '@sovryn/onboard-common';

export const getSigner = (wallet: EIP1193Provider) => {
  const provider = new providers.Web3Provider(wallet);
  return provider.getSigner();
};
