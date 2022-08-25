import { firstValueFrom } from "rxjs";
import { filter, withLatestFrom, map } from "rxjs/operators";
import { configuration } from "./configuration";
import { state } from "./store";
import { setWalletModules } from "./store/actions";
import type { WalletState } from "./types";
import { wait } from "./utils";
import { connectWallet$, wallets$ } from "./streams";

export default async function connectWallet(
  wallet?: string
): Promise<WalletState[]> {
  const { chains } = state.get();

  if (!chains.length) {
    throw new Error(
      "At least one chain must be set before attempting to connect a wallet"
    );
  }

  if (wallet) {
    await wait(50);
  }

  if (!state.get().walletModules.length) {
    setWalletModules(configuration.initialWalletInit);
  }

  connectWallet$.next({
    module: wallet,
    inProgress: true,
  });

  const result$ = connectWallet$.pipe(
    filter(
      ({ inProgress, actionRequired }) =>
        inProgress === false && !actionRequired
    ),
    withLatestFrom(wallets$),
    map((x) => x?.[1])
  );

  return firstValueFrom(result$);
}
