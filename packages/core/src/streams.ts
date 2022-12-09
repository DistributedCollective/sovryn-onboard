import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { withLatestFrom, pluck, shareReplay } from 'rxjs/operators';

import type { Chain } from '@sovryn/onboard-common';

import { resetStore } from './store/actions';
import { state } from './store/index';
import type { WalletState } from './types';

export const reset$ = new Subject<void>();
export const disconnectWallet$ = new Subject<WalletState['label']>();

export const connectWallet$ = new BehaviorSubject<{
  inProgress: boolean;
  module?: string;
  actionRequired?: string;
  error?: string;
}>({ inProgress: false, actionRequired: '' });

export const switchChainModal$ = new BehaviorSubject<null | {
  chain: Chain;
}>(null);

export const wallets$ = (
  state.select('wallets') as Observable<WalletState[]>
).pipe(shareReplay(1));

// reset logic
reset$.pipe(withLatestFrom(wallets$), pluck('1')).subscribe(wallets => {
  // disconnect all wallets
  wallets.forEach(({ label }) => {
    disconnectWallet$.next(label);
  });

  resetStore();
});
