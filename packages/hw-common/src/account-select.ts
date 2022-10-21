import { firstValueFrom, take } from "rxjs";
import {} from "@sovryn/onboard-core";
import { accounts$ } from "./streams";
import { validateSelectAccountOptions } from "./validation";

import type { SelectAccountOptions, Account } from "./types";
import { closeAccountSelect, openAccountSelect } from "./actions";

export let selectAccountOptions: SelectAccountOptions;

const accountSelect = async (
  options: SelectAccountOptions
): Promise<Account[]> => {
  console.log("selecting account", options);
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
