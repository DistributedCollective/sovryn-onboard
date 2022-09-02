import { Subject, BehaviorSubject } from 'rxjs';
import type { Account } from './types';

export const selectAccounts$ = new BehaviorSubject<{
  actionRequired?: string;
  inProgress: boolean;
}>({ inProgress: false, actionRequired: '' });

export const accounts$ = new Subject<Account[]>();
