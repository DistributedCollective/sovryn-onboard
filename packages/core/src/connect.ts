import { firstValueFrom } from "rxjs";
import { filter, withLatestFrom, map } from "rxjs/operators";
import EventEmitter from "eventemitter3";
import { BigNumber } from "ethers";
import { configuration } from "./configuration";
import { state } from "./store";
import { addWallet, setWalletModules } from "./store/actions";
import type { WalletState } from "./types";
import { wait } from "./utils";
import { connectWallet$, wallets$ } from "./streams";
import { ProviderRpcErrorCode, WalletModule } from "@sovryn/onboard-common";
import { getChainId, requestAccounts, trackWallet } from "./provider";

export default async function connect(wallet?: string): Promise<WalletState[]> {
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

export const loadWalletModule = async (
  walletModule: WalletModule
): Promise<WalletState> => {
  try {
    const existingWallet = state
      .get()
      .wallets.find((wallet) => wallet.label === walletModule.label);

    if (existingWallet) {
      // set as first wallet
      addWallet(existingWallet);

      try {
        await requestAccounts(existingWallet.provider);
      } catch (error) {
        const { code } = error as { code: number };

        if (
          code === ProviderRpcErrorCode.UNSUPPORTED_METHOD ||
          code === ProviderRpcErrorCode.DOES_NOT_EXIST
        ) {
          connectWallet$.next({
            inProgress: false,
            actionRequired: existingWallet.label,
          });
        }
      }

      return existingWallet;
    }

    const { chains } = state.get();

    const { provider, instance } = await walletModule.getInterface({
      chains,
      BigNumber,
      EventEmitter,
      appMetadata: null,
    });

    const loadedIcon = await walletModule.getIcon();

    return {
      label: walletModule.label,
      icon: loadedIcon,
      provider,
      instance,
      accounts: [],
      chains: [{ namespace: "evm", id: "0x1" }],
    };
  } catch (error) {
    throw error;
  }
};

export const connectWallet = async (walletModule: WalletModule) => {
  try {
    connectWallet$.next({
      error: undefined,
      inProgress: true,
    });
    const selectedWallet = await loadWalletModule(walletModule);

    const { provider, label } = selectedWallet;

    const [address] = await requestAccounts(provider);

    // canceled previous request
    if (!address) {
      return;
    }

    const chain = await getChainId(provider);

    const update: Pick<WalletState, "accounts" | "chains"> = {
      accounts: [{ address }],
      chains: [{ namespace: "evm", id: chain }],
    };

    addWallet({ ...selectedWallet, ...update });
    trackWallet(provider, label);

    connectWallet$.next({
      inProgress: false,
    });
  } catch (error) {
    const { code, message } = error as { code: number; message: string };

    connectWallet$.next({
      error: message,
      inProgress: true,
    });

    // user rejected account access
    if (code === ProviderRpcErrorCode.ACCOUNT_ACCESS_REJECTED) {
      // connectionRejected = true

      // if (autoSelect.disableModals) {
      //   connectWallet$.next({ inProgress: false })
      // } else if (autoSelect.label) {
      //   autoSelect.label = ''
      // }

      return;
    }

    // account access has already been requested and is awaiting approval
    if (code === ProviderRpcErrorCode.ACCOUNT_ACCESS_ALREADY_REQUESTED) {
      return;
    }
  }
};
