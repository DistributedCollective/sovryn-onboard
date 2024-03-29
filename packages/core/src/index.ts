import setChain from './chain';
import { updateConfiguration } from './configuration';
import connect, { connectWallet, loadWalletModule } from './connect';
import disconnectWallet from './disconnect';
import { isHardwareWallet } from './helpers';
import initI18N, { changeLanguage } from './i18n';
import { state } from './store';
import { addChains, setPrimaryWallet, setWalletModules } from './store/actions';
import { InitOptions } from './types';
import { chainIdToHex } from './utils';
import { validateInitOptions } from './validation';

export * from './types';

const API = {
  connectWallet: connect,
  disconnectWallet,
  setChain,
  state: {
    get: state.get,
    select: state.select,
    actions: {
      setWalletModules,
      setPrimaryWallet,
    },
  },
  changeLanguage,
};

const helpers = {
  loadWalletModule,
  connectWallet,
  isHardwareWallet,
};

export type OnboardAPI = typeof API;

function init(options: InitOptions): OnboardAPI {
  if (typeof window === 'undefined') {
    return API;
  }

  if (options) {
    const error = validateInitOptions(options);
    if (error) {
      throw error;
    }
  }

  const { wallets, chains, i18n } = options;

  addChains(chainIdToHex(chains));

  updateConfiguration({
    initialWalletInit: wallets,
  });

  initI18N(i18n);

  return API;
}

export default init;

export { state, helpers };
