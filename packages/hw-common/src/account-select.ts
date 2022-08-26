import { firstValueFrom, Subject, take } from "rxjs";
import {} from "@sovryn/onboard-core";
import { accounts$, selectAccounts$ } from "./streams";
import { validateSelectAccountOptions } from "./validation";

import type { SelectAccountOptions, Account } from "./types";

export let selectAccountOptions: SelectAccountOptions;

const accountSelect = async (
  options: SelectAccountOptions
): Promise<Account[]> => {
  if (options) {
    const error = validateSelectAccountOptions(options);

    if (error) {
      throw error;
    }
  }

  selectAccountOptions = options;

  selectAccounts$.next({
    inProgress: true,
  });

  accounts$.pipe(take(1)).subscribe((e) => {
    selectAccounts$.next({
      inProgress: false,
    });
  });

  return firstValueFrom(accounts$);
};

export default accountSelect;
