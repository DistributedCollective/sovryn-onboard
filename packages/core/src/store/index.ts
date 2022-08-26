import { BehaviorSubject, Observable, Subject } from "rxjs";
import { distinctUntilKeyChanged, map, filter } from "rxjs/operators";
import { Chain, WalletModule } from "@sovryn/onboard-common";
import { APP_INITIAL_STATE } from "../constants";
import type {
  Action,
  AddWalletAction,
  AppState,
  UpdateAccountAction,
  UpdateWalletAction,
  WalletState,
} from "../types";
import {
  ADD_CHAINS,
  ADD_WALLET,
  REMOVE_WALLET,
  RESET_STORE,
  SET_WALLET_MODULES,
  UPDATE_ACCOUNT,
  UPDATE_WALLET,
} from "./constants";
import { notNullish } from "../utils";

const _store = new BehaviorSubject<AppState>(APP_INITIAL_STATE);
const _stateUpdates = new Subject<AppState>();

_stateUpdates.subscribe(_store);

function reducer(state: AppState, action: Action): AppState {
  const { type, payload } = action;

  switch (type) {
    case ADD_CHAINS:
      return {
        ...state,
        chains: [...state.chains, ...(payload as Chain[])],
      };

    case ADD_WALLET: {
      const wallet = payload as AddWalletAction["payload"];
      const existingWallet = state.wallets.find(
        ({ label }) => label === wallet.label
      );

      return {
        ...state,
        wallets: [
          // add to front of wallets as it is now the primary wallet
          existingWallet || (payload as WalletState),
          // filter out wallet if it already existed
          ...state.wallets.filter(({ label }) => label !== wallet.label),
        ],
      };
    }

    case UPDATE_WALLET: {
      const update = payload as UpdateWalletAction["payload"];
      const { id, ...walletUpdate } = update;

      const updatedWallets = state.wallets.map((wallet) =>
        wallet.label === id ? { ...wallet, ...walletUpdate } : wallet
      );

      return {
        ...state,
        wallets: updatedWallets,
      };
    }

    case REMOVE_WALLET: {
      const update = payload as { id: string };

      return {
        ...state,
        wallets: state.wallets.filter(({ label }) => label !== update.id),
      };
    }

    case UPDATE_ACCOUNT: {
      const update = payload as UpdateAccountAction["payload"];
      const { id, address, ...accountUpdate } = update;

      const updatedWallets = state.wallets.map((wallet) => {
        if (wallet.label === id) {
          wallet.accounts = wallet.accounts.map((account) => {
            if (account.address === address) {
              return { ...account, ...accountUpdate };
            }

            return account;
          });
        }

        return wallet;
      });

      return {
        ...state,
        wallets: updatedWallets,
      };
    }

    case SET_WALLET_MODULES: {
      return {
        ...state,
        walletModules: payload as WalletModule[],
      };
    }

    case RESET_STORE:
      return APP_INITIAL_STATE;

    default:
      throw new Error(`Unknown type: ${type} in appStore reducer`);
  }
}

export function dispatch(action: Action): void {
  const state = _store.getValue();
  _stateUpdates.next(reducer(state, action));
}

function select(): Observable<AppState>;
function select<T extends keyof AppState>(stateKey: T): Observable<AppState[T]>;
function select<T extends keyof AppState>(
  stateKey?: keyof AppState
): Observable<AppState[T]> | Observable<AppState> {
  if (!stateKey) return _stateUpdates.asObservable();

  const validStateKeys = Object.keys(_store.getValue());

  if (!validStateKeys.includes(String(stateKey))) {
    throw new Error(`key: ${stateKey} does not exist on this store`);
  }

  return _stateUpdates.asObservable().pipe(
    distinctUntilKeyChanged(stateKey),
    map((x) => x?.[stateKey]),
    filter(notNullish)
  ) as Observable<AppState[T]>;
}

function get(): AppState {
  return _store.getValue();
}

export const state = {
  select,
  get,
};
