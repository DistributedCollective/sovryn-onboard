import { accounts$, selectAccounts$ } from './streams';
import type { Account } from './types';

export const selectAccount = (account: Account) => accounts$.next([account]);

export const openAccountSelect = () =>
  selectAccounts$.next({
    inProgress: true,
  });

export const closeAccountSelect = () =>
  selectAccounts$.next({
    inProgress: false,
  });
