import type { Chain, WalletInit, WalletModule } from "@sovryn/onboard-common";
import { dispatch } from "./index";
import { configuration } from "../configuration";

import type {
  Account,
  AddChainsAction,
  AddWalletAction,
  RemoveWalletAction,
  ResetStoreAction,
  SetWalletModulesAction,
  UpdateAccountAction,
  UpdateWalletAction,
  WalletState,
} from "../types";

import {
  validateString,
  validateWallet,
  validateWalletInit,
} from "../validation";

import {
  ADD_CHAINS,
  ADD_WALLET,
  REMOVE_WALLET,
  RESET_STORE,
  SET_WALLET_MODULES,
  UPDATE_ACCOUNT,
  UPDATE_WALLET,
} from "./constants";

export function addChains(chains: Chain[]): void {
  // chains are validated on init
  const action = {
    type: ADD_CHAINS,
    payload: chains.map(({ namespace = "evm", id, ...rest }) => ({
      ...rest,
      namespace,
      id: id.toLowerCase(),
    })),
  };

  dispatch(action as AddChainsAction);
}

export function addWallet(wallet: WalletState): void {
  const error = validateWallet(wallet);

  if (error) {
    console.error(error);
    throw error;
  }

  const action = {
    type: ADD_WALLET,
    payload: wallet,
  };

  dispatch(action as AddWalletAction);
}

export function updateWallet(id: string, update: Partial<WalletState>): void {
  const error = validateWallet(update);

  if (error) {
    console.error(error);
    throw error;
  }

  const action = {
    type: UPDATE_WALLET,
    payload: {
      id,
      ...update,
    },
  };

  dispatch(action as UpdateWalletAction);
}

export function removeWallet(id: string): void {
  const error = validateString(id, "wallet id");

  if (error) {
    throw error;
  }

  const action = {
    type: REMOVE_WALLET,
    payload: {
      id,
    },
  };

  dispatch(action as RemoveWalletAction);
}

export function setPrimaryWallet(wallet: WalletState, address?: string): void {
  const error =
    validateWallet(wallet) || (address && validateString(address, "address"));

  if (error) {
    throw error;
  }

  // if also setting the primary account
  if (address) {
    const account = wallet.accounts.find((ac) => ac.address === address);

    if (account) {
      wallet.accounts = [
        account,
        ...wallet.accounts.filter(({ address }) => address !== account.address),
      ];
    }
  }

  // add wallet will set it to first wallet since it already exists
  addWallet(wallet);
}

export function updateAccount(
  id: string,
  address: string,
  update: Partial<Account>
): void {
  const action = {
    type: UPDATE_ACCOUNT,
    payload: {
      id,
      address,
      ...update,
    },
  };

  dispatch(action as UpdateAccountAction);
}

export function resetStore(): void {
  const action = {
    type: RESET_STORE,
  };

  dispatch(action as ResetStoreAction);
}

export function setWalletModules(wallets: WalletInit[]): void {
  const error = validateWalletInit(wallets);

  if (error) {
    throw error;
  }

  const modules = initializeWalletModules(wallets);
  const dedupedWallets = uniqueWalletsByLabel(modules);

  const action = {
    type: SET_WALLET_MODULES,
    payload: dedupedWallets,
  };

  dispatch(action as SetWalletModulesAction);
}

// ==== HELPERS ==== //
export function initializeWalletModules(modules: WalletInit[]): WalletModule[] {
  const { device } = configuration;
  return modules.reduce((acc, walletInit) => {
    const initialized = walletInit({ device });

    if (initialized) {
      // injected wallets is an array of wallets
      acc.push(...(Array.isArray(initialized) ? initialized : [initialized]));
    }

    return acc;
  }, [] as WalletModule[]);
}

export function uniqueWalletsByLabel(
  walletModuleList: WalletModule[]
): WalletModule[] {
  return walletModuleList.filter(
    (wallet, i) =>
      walletModuleList.findIndex(
        (innerWallet: WalletModule) => innerWallet.label === wallet.label
      ) === i
  );
}
