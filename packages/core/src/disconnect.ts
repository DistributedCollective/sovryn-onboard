import { state } from './store/index';
import { removeWallet } from './store/actions';
import { disconnectWallet$ } from './streams';
import type { WalletState } from './types';

async function disconnect(module: string): Promise<WalletState[]> {
  disconnectWallet$.next(module);
  removeWallet(module);

  return state.get().wallets;
}

export default disconnect;
