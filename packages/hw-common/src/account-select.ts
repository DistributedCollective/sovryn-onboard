import { firstValueFrom, take } from 'rxjs';

import '@sovryn/onboard-core';

import { closeAccountSelect, openAccountSelect } from './actions';
import { accounts$ } from './streams';
import type { SelectAccountOptions, Account } from './types';
import { validateSelectAccountOptions } from './validation';

export let selectAccountOptions: SelectAccountOptions;

const accountSelect = async (
  options: SelectAccountOptions,
): Promise<Account[]> => {
  if (options) {
    const error = validateSelectAccountOptions(options);

    if (error) {
      throw error;
    }
  }

  selectAccountOptions = options;

  openAccountSelect();

  accounts$.pipe(take(1)).subscribe(() => closeAccountSelect());

  return firstValueFrom(accounts$);
};

export default accountSelect;
