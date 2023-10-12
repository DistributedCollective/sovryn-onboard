import type { EthereumProviderOptions } from '@walletconnect/ethereum-provider/dist/types/EthereumProvider';
import type { CoreTypes } from '@walletconnect/types';

import { t } from 'i18next';
import type { JQueryStyleEventEmitter } from 'rxjs/internal/observable/fromEvent';

import type {
  Chain,
  ProviderAccounts,
  WalletInit,
  EIP1193Provider,
} from '@sovryn/onboard-common';

import type { WalletConnectOptions } from './index';
import { isHexString } from './index';

// methods that require user interaction
const methods = [
  'eth_sendTransaction',
  'eth_signTransaction',
  'personal_sign',
  'eth_sign',
  'eth_signTypedData',
  'eth_signTypedData_v4',
];

function walletConnect(options: WalletConnectOptions): WalletInit {
  if (options.version !== 2 || !options.projectId) {
    throw new Error(
      'WalletConnect requires a projectId. Please visit https://cloud.walletconnect.com to get one.',
    );
  }
  const {
    projectId,
    handleUri,
    requiredChains,
    optionalChains,
    qrModalOptions,
    additionalOptionalMethods,
    dappUrl,
  } = options;

  return () => {
    return {
      label: 'WalletConnect',
      getIcon: async () => (await import('./icon')).default,
      getInterface: async ({ chains, EventEmitter, appMetadata }) => {
        const { ProviderRpcError, ProviderRpcErrorCode } = await import(
          '@sovryn/onboard-common'
        );

        const { default: EthereumProvider } = await import(
          '@walletconnect/ethereum-provider'
        );

        const { Subject, fromEvent } = await import('rxjs');
        const { takeUntil, take } = await import('rxjs/operators');

        const getMetaData = (): CoreTypes.Metadata | undefined => {
          if (!appMetadata) return undefined;
          const url = dappUrl || appMetadata.explore || '';

          !url &&
            !url.length &&
            console.warn(
              `It is strongly recommended to supply a dappUrl as it is required by some wallets (i.e. MetaMask) to allow connection.`,
            );
          const wcMetaData: CoreTypes.Metadata = {
            name: appMetadata.name,
            description: appMetadata.description || '',
            url,
            icons: [],
          };

          if (appMetadata.icon !== undefined && appMetadata.icon.length) {
            wcMetaData.icons = [appMetadata.icon];
          }
          if (appMetadata.logo !== undefined && appMetadata.logo.length) {
            wcMetaData.icons = wcMetaData.icons.length
              ? [...wcMetaData.icons, appMetadata.logo]
              : [appMetadata.logo];
          }

          return wcMetaData;
        };

        // default to mainnet
        const requiredChainsParsed: number[] =
          Array.isArray(requiredChains) &&
          requiredChains.length &&
          requiredChains.every(num => !isNaN(num))
            ? // @ts-ignore
              // Required as WC package does not support hex numbers
              requiredChains.map(chainID => parseInt(chainID))
            : [];

        // Defaults to the chains provided within the web3-onboard init chain property
        const optionalChainsParsed: number[] =
          Array.isArray(optionalChains) &&
          optionalChains.length &&
          optionalChains.every(num => !isNaN(num))
            ? // @ts-ignore
              // Required as WC package does not support hex numbers
              optionalChains.map(chainID => parseInt(chainID))
            : chains.map(({ id }) => parseInt(id, 16));

        const optionalMethods =
          additionalOptionalMethods && Array.isArray(additionalOptionalMethods)
            ? [...additionalOptionalMethods, ...methods]
            : methods;

        const connector = await EthereumProvider.init({
          projectId,
          chains: requiredChainsParsed, // default to mainnet
          optionalChains: optionalChainsParsed,
          optionalMethods,
          showQrModal: true,
          rpcMap: chains
            .map(({ id, rpcUrl }) => ({ id, rpcUrl }))
            .reduce((rpcMap: Record<number, string>, { id, rpcUrl }) => {
              rpcMap[parseInt(id, 16)] = rpcUrl || '';
              return rpcMap;
            }, {}),
          metadata: getMetaData(),
          qrModalOptions: qrModalOptions,
        } as EthereumProviderOptions);

        const emitter = new EventEmitter();
        class EthProvider {
          public request: EIP1193Provider['request'];
          public connector: InstanceType<typeof EthereumProvider>;
          public chains: Chain[];
          public disconnect: EIP1193Provider['disconnect'];
          // @ts-ignore
          public emit: typeof EventEmitter['emit'];
          // @ts-ignore
          public on: typeof EventEmitter['on'];
          // @ts-ignore
          public removeListener: typeof EventEmitter['removeListener'];

          private disconnected$: InstanceType<typeof Subject>;

          constructor({
            connector,
            chains,
          }: {
            connector: InstanceType<typeof EthereumProvider>;
            chains: Chain[];
          }) {
            this.emit = emitter.emit.bind(emitter);
            this.on = emitter.on.bind(emitter);
            this.removeListener = emitter.removeListener.bind(emitter);

            this.connector = connector;
            this.chains = chains;
            this.disconnected$ = new Subject();

            // listen for accountsChanged
            fromEvent(this.connector, 'accountsChanged', payload => payload)
              .pipe(takeUntil(this.disconnected$))
              .subscribe({
                next: payload => {
                  const accounts = Array.isArray(payload) ? payload : [payload];
                  this.emit('accountsChanged', accounts);
                },
                error: console.warn,
              });

            // listen for chainChanged
            fromEvent(
              this.connector as JQueryStyleEventEmitter<any, number>,
              'chainChanged',
              (payload: number) => payload,
            )
              .pipe(takeUntil(this.disconnected$))
              .subscribe({
                next: chainId => {
                  const hexChainId = isHexString(chainId)
                    ? chainId
                    : `0x${chainId.toString(16)}`;
                  this.emit('chainChanged', hexChainId);
                },
                error: console.warn,
              });

            // listen for disconnect event
            fromEvent(
              this.connector as JQueryStyleEventEmitter<any, string>,
              'session_delete',
              (payload: string) => payload,
            )
              .pipe(takeUntil(this.disconnected$))
              .subscribe({
                next: () => {
                  this.emit('accountsChanged', []);
                  this.disconnected$.next(true);
                  typeof localStorage !== 'undefined' &&
                    localStorage.removeItem('walletconnect');
                },
                error: console.warn,
              });

            this.disconnect = () => {
              if (this.connector.session) this.connector.disconnect();
            };

            if (options && handleUri) {
              // listen for uri event
              fromEvent(
                this.connector as JQueryStyleEventEmitter<any, string>,
                'display_uri',
                (payload: string) => payload,
              )
                .pipe(takeUntil(this.disconnected$))
                .subscribe(async uri => {
                  try {
                    handleUri && (await handleUri(uri));
                  } catch (error) {
                    throw `An error occurred when handling the URI. Error: ${error}`;
                  }
                });
            }

            const checkForSession = () => {
              const session = this.connector.session;
              if (session) {
                this.emit('accountsChanged', this.connector.accounts);
                this.emit('chainChanged', this.connector.chainId);
              }
            };
            checkForSession();

            this.request = async ({ method, params }) => {
              if (method === 'eth_chainId') {
                return isHexString(this.connector.chainId)
                  ? this.connector.chainId
                  : `0x${this.connector.chainId.toString(16)}`;
              }

              if (method === 'eth_requestAccounts') {
                return new Promise<ProviderAccounts>(
                  async (resolve, reject) => {
                    // Subscribe to connection events
                    fromEvent(
                      this.connector as JQueryStyleEventEmitter<
                        any,
                        { chainId: number }
                      >,
                      'connect',
                      (payload: { chainId: number | string }) => payload,
                    )
                      .pipe(take(1))
                      .subscribe({
                        next: ({ chainId }) => {
                          this.emit('accountsChanged', this.connector.accounts);
                          const hexChainId = isHexString(chainId)
                            ? chainId
                            : `0x${chainId.toString(16)}`;
                          this.emit('chainChanged', hexChainId);
                          resolve(this.connector.accounts);
                        },
                        error: reject,
                      });

                    // Check if connection is already established
                    if (!this.connector.session) {
                      // create new session
                      await this.connector.connect().catch(err => {
                        console.error('err creating new session: ', err);
                        reject(
                          new ProviderRpcError({
                            code: 4001,
                            message: t('errors.userReject'),
                          }),
                        );
                      });
                    } else {
                      // update ethereum provider to load accounts & chainId
                      const accounts = this.connector.accounts;
                      const chainId = this.connector.chainId;
                      const hexChainId = `0x${chainId.toString(16)}`;
                      this.emit('chainChanged', hexChainId);
                      return resolve(accounts);
                    }
                  },
                );
              }

              if (method === 'eth_selectAccounts') {
                throw new ProviderRpcError({
                  code: ProviderRpcErrorCode.UNSUPPORTED_METHOD,
                  message: `The Provider does not support the requested method: ${method}`,
                });
              }

              if (method === 'wallet_switchEthereumChain') {
                if (!params) {
                  throw new ProviderRpcError({
                    code: ProviderRpcErrorCode.INVALID_PARAMS,
                    message: `The Provider requires a chainId to be passed in as an argument`,
                  });
                }
                const chainIdObj = params[0] as { chainId?: number };
                if (
                  !chainIdObj.hasOwnProperty('chainId') ||
                  typeof chainIdObj['chainId'] === 'undefined'
                ) {
                  throw new ProviderRpcError({
                    code: ProviderRpcErrorCode.INVALID_PARAMS,
                    message: `The Provider requires a chainId to be passed in as an argument`,
                  });
                }
                return this.connector.request({
                  method: 'wallet_switchEthereumChain',
                  params: [
                    {
                      chainId: chainIdObj.chainId,
                    },
                  ],
                });
              }

              return this.connector.request<Promise<any>>({
                method,
                params,
              });
            };
          }
        }

        return {
          provider: new EthProvider({ chains, connector }),
        };
      },
    };
  };
}

export default walletConnect;
