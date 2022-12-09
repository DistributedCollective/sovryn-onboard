import { providers } from 'ethers';
import partition from 'lodash.partition';
import { fromEventPattern, Observable } from 'rxjs';
import { filter, takeUntil, take, share, switchMap } from 'rxjs/operators';

import type {
  ChainId,
  EIP1102Request,
  EIP1193Provider,
  ProviderAccounts,
  Chain,
  AccountsListener,
  ChainListener,
  SelectAccountsRequest,
} from '@sovryn/onboard-common';

import disconnect from './disconnect';
import { updateAccount, updateWallet } from './store/actions';
import { state } from './store/index';
import { disconnectWallet$ } from './streams';
import type { Account, WalletState } from './types';

export const ethersProviders: {
  [key: string]: providers.StaticJsonRpcProvider;
} = {};

export function getProvider(chain: Chain): providers.StaticJsonRpcProvider {
  // @ts-ignore - This is a hack to get around the fact that the `chain` object
  if (!chain) return null;

  if (!ethersProviders[chain.rpcUrl]) {
    ethersProviders[chain.rpcUrl] = new providers.StaticJsonRpcProvider(
      chain.providerConnectionInfo && chain.providerConnectionInfo.url
        ? chain.providerConnectionInfo
        : chain.rpcUrl,
    );
  }

  return ethersProviders[chain.rpcUrl];
}

export function requestAccounts(
  provider: EIP1193Provider,
): Promise<ProviderAccounts> {
  const args = { method: 'eth_requestAccounts' } as EIP1102Request;
  return provider.request(args);
}

export function selectAccounts(
  provider: EIP1193Provider,
): Promise<ProviderAccounts> {
  const args = { method: 'eth_selectAccounts' } as SelectAccountsRequest;
  return provider.request(args);
}

export function getChainId(provider: EIP1193Provider): Promise<string> {
  return provider.request({ method: 'eth_chainId' }) as Promise<string>;
}

export function listenAccountsChanged(args: {
  provider: EIP1193Provider;
  disconnected$: Observable<string>;
}): Observable<ProviderAccounts> {
  const { provider, disconnected$ } = args;

  const addHandler = (handler: AccountsListener) => {
    provider.on('accountsChanged', handler);
  };

  const removeHandler = (handler: AccountsListener) => {
    provider.removeListener('accountsChanged', handler);
  };

  return fromEventPattern<ProviderAccounts>(addHandler, removeHandler).pipe(
    takeUntil(disconnected$),
  );
}

export function listenChainChanged(args: {
  provider: EIP1193Provider;
  disconnected$: Observable<string>;
}): Observable<ChainId> {
  const { provider, disconnected$ } = args;
  const addHandler = (handler: ChainListener) => {
    provider.on('chainChanged', handler);
  };

  const removeHandler = (handler: ChainListener) => {
    provider.removeListener('chainChanged', handler);
  };

  return fromEventPattern<ChainId>(addHandler, removeHandler).pipe(
    takeUntil(disconnected$),
  );
}

export function trackWallet(
  provider: EIP1193Provider,
  label: WalletState['label'],
): void {
  const disconnected$ = disconnectWallet$.pipe(
    filter(wallet => wallet === label),
    take(1),
  );

  const accountsChanged$ = listenAccountsChanged({
    provider,
    disconnected$,
  }).pipe(share());

  // when account changed, set it to first account and subscribe to events
  accountsChanged$.subscribe(async ([address]) => {
    // no address, then no account connected, so disconnect wallet
    // this could happen if user locks wallet,
    // or if disconnects app from wallet
    if (!address) {
      disconnect(label);
      return;
    }

    const { wallets } = state.get();
    const { accounts } = wallets.find(
      wallet => wallet.label === label,
    ) as WalletState;

    const [[existingAccount], restAccounts] = partition(
      accounts,
      account => account.address === address,
    );

    // update accounts without ens and balance first
    updateWallet(label, {
      accounts: [
        existingAccount || { address: address, ens: null, balance: null },
        ...restAccounts,
      ],
    });
  });

  // also when accounts change, update Balance and ENS
  accountsChanged$
    .pipe(
      switchMap(async ([address]) => {
        if (!address) return;

        // const { wallets } = state.get();

        // const { chains: walletChains } = wallets.find(
        //   wallet => wallet.label === label,
        // ) as WalletState;

        // const [connectedWalletChain] = walletChains;

        // const chain = chains.find(
        //   ({ namespace, id }) =>
        //     namespace === 'evm' && id === connectedWalletChain.id
        // ) as Chain;

        // const balanceProm = getBalance(address, chain)
        // const account = accounts.find(account => account.address === address)

        // const ensProm = account.ens
        //   ? Promise.resolve(account.ens)
        //   : validEnsChain(connectedWalletChain.id)
        //   ? getEns(address, chain)
        //   : Promise.resolve(null)

        return Promise.all([Promise.resolve(address) /*, balanceProm */]);
      }),
    )
    .subscribe(res => {
      if (!res) return;
      const [address] = res;
      updateAccount(label, address, {});
    });

  const chainChanged$ = listenChainChanged({ provider, disconnected$ }).pipe(
    share(),
  );

  // Update chain on wallet when chainId changed
  chainChanged$.subscribe(async chainId => {
    const { wallets } = state.get();
    const { chains, accounts } = wallets.find(
      wallet => wallet.label === label,
    ) as WalletState;
    const [connectedWalletChain] = chains;

    if (chainId === connectedWalletChain.id) return;

    const resetAccounts = accounts.map(
      ({ address }) =>
        ({
          address,
          ens: null,
          balance: null,
        } as Account),
    );

    updateWallet(label, {
      chains: [{ namespace: 'evm', id: chainId }],
      accounts: resetAccounts,
    });
  });

  // when chain changes get ens and balance for each account for wallet
  chainChanged$
    .pipe(
      switchMap(async () => {
        const { wallets } = state.get();
        const { accounts } = wallets.find(
          wallet => wallet.label === label,
        ) as WalletState;

        // const chain = chains.find(
        //   ({ namespace, id }) => namespace === 'evm' && id === chainId,
        // );

        return Promise.all(
          accounts.map(async ({ address }) => {
            // const balanceProm = getBalance(address, chain)

            // const ensProm = validEnsChain(chainId)
            //   ? getEns(address, chain)
            //   : Promise.resolve(null)

            // const [balance, ens] = await Promise.all([balanceProm, ensProm])
            return {
              address,
              balance: null,
              ens: null,
            };
          }),
        );
      }),
    )
    .subscribe(updatedAccounts => {
      updatedAccounts && updateWallet(label, { accounts: updatedAccounts });
    });

  disconnected$.subscribe(() => {
    provider.disconnect && provider.disconnect();
  });
}

export function switchChain(
  provider: EIP1193Provider,
  chainId: ChainId,
): Promise<unknown> {
  return provider.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId }],
  });
}

export function addNewChain(
  provider: EIP1193Provider,
  chain: Chain,
): Promise<unknown> {
  return provider.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: chain.id,
        chainName: chain.label,
        nativeCurrency: {
          name: chain.label,
          symbol: chain.token,
          decimals: 18,
        },
        rpcUrls: [chain.publicRpcUrl || chain.rpcUrl],
        blockExplorerUrls: chain.blockExplorerUrl
          ? [chain.blockExplorerUrl]
          : undefined,
      },
    ],
  });
}
