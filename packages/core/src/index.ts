import { updateConfiguration } from "./configuration";
import connectWallet from "./connect";
import disconnectWallet from "./disconnect";
import { state } from "./store";
import { addChains, setPrimaryWallet, setWalletModules } from "./store/actions";
import { InitOptions } from "./types";
import { chainIdToHex } from "./utils";
import { validateInitOptions } from "./validation";

const API = {
  connectWallet,
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
