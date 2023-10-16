import type {
  Chain,
  ChainWithDecimalId,
  Device,
  EIP1193Provider,
  WalletInit,
  WalletModule,
} from '@sovryn/onboard-common';

import type en from './i18n/en.json';

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
export type i18n = RecursivePartial<typeof en>;

type Locale = string; // eg 'en', 'es'
export type i18nOptions = Record<Locale, i18n>;

export interface InitOptions {
  wallets: WalletInit[];
  chains: Chain[] | ChainWithDecimalId[];
  i18n?: i18nOptions;
}

export type Configuration = {
  initialWalletInit: WalletInit[];
  device: Device | DeviceNotBrowser;
};

export interface AppState {
  chains: Chain[];
  walletModules: WalletModule[];
  wallets: WalletState[];
}

export type Address = string;

export type ConnectedChain = {
  id: Chain['id'];
  namespace: Chain['namespace'];
};

export interface WalletState {
  label: string; //  wallet name
  icon: string; // wallet icon svg string
  provider: EIP1193Provider;
  accounts: Account[];
  chains: ConnectedChain[];
  instance?: unknown;
}

export type Account = {
  address: Address;
};

// ==== ACTIONS ==== //
export type Action =
  | AddChainsAction
  | AddWalletAction
  | UpdateWalletAction
  | RemoveWalletAction
  | ResetStoreAction
  | UpdateAccountAction
  | SetWalletModulesAction;

export type AddChainsAction = { type: 'add_chains'; payload: Chain[] };
export type AddWalletAction = { type: 'add_wallet'; payload: WalletState };
export type UpdateWalletAction = {
  type: 'update_wallet';
  payload: { id: string } & Partial<WalletState>;
};
export type RemoveWalletAction = {
  type: 'remove_wallet';
  payload: { id: string };
};

export type ResetStoreAction = {
  type: 'reset_store';
  payload: unknown;
};

export type UpdateAccountAction = {
  type: 'update_account';
  payload: { id: string; address: string } & Partial<Account>;
};

export type SetWalletModulesAction = {
  type: 'set_wallet_modules';
  payload: WalletModule[];
};

export type DeviceNotBrowser = {
  type: null;
  os: null;
  browser: null;
};
