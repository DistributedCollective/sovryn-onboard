import { updateConfiguration } from "./configuration";
import connect, { connectWallet, loadWalletModule } from "./connect";
import disconnectWallet from "./disconnect";
import { state } from "./store";
import { addChains, setPrimaryWallet, setWalletModules } from "./store/actions";
import { InitOptions } from "./types";
import { chainIdToHex } from "./utils";
import { validateInitOptions } from "./validation";

export * from "./types";

const API = {
  connectWallet: connect,
  disconnectWallet,
  state: {
    get: state.get,
    select: state.select,
    actions: {
      setWalletModules,
      setPrimaryWallet,
    },
  },
};

const helpers = {
  loadWalletModule,
  connectWallet,
};

export type OnboardAPI = typeof API;

function init(options: InitOptions): OnboardAPI {
  if (typeof window === "undefined") {
    return API;
  }

  if (options) {
    const error = validateInitOptions(options);
    if (error) {
      throw error;
    }
  }

  const { wallets, chains } = options;

  addChains(chainIdToHex(chains));

  updateConfiguration({
    initialWalletInit: wallets,
  });

  return API;
}

export default init;

export { state, helpers };
