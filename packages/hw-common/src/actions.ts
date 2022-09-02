import { accounts$ } from './streams';
import type { Account } from './types';

export const selectAccount = (account: Account) => accounts$.next([account]);
