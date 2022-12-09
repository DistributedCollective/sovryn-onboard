import { removeWallet } from './store/actions';
import { state } from './store/index';
import { disconnectWallet$ } from './streams';
import type { WalletState } from './types';

async function disconnect(module?: string): Promise<WalletState[]> {
  if (module) {
    disconnectWallet$.next(module);
    removeWallet(module);
  } else {
    const { wallets } = state.get();
    wallets.forEach(({ label }) => {
      disconnectWallet$.next(label);
      removeWallet(label);
    });
  }

  return state.get().wallets;
}

export default disconnect;
