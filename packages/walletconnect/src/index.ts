import type { StaticJsonRpcProvider as StaticJsonRpcProviderType } from "@ethersproject/providers";

import type {
  Chain,
  ProviderAccounts,
  WalletInit,
  EIP1193Provider,
} from "@sovryn/onboard-common";

interface WalletConnectOptions {
  bridge?: string;
  qrcodeModalOptions?: {
    mobileLinks: string[];
  };
  connectFirstChainId?: boolean;
}

function walletConnect(options?: WalletConnectOptions): WalletInit {
  const {
    bridge = "https://bridge.walletconnect.org",
    qrcodeModalOptions,
    connectFirstChainId,
  } = options || {};

  return () => {
    return {
      label: "WalletConnect",
      getIcon: async () => (await import("./icon.js")).default,
      getInterface: async ({ chains, EventEmitter }) => {
        const { StaticJsonRpcProvider } = await import(
          "@ethersproject/providers"
        );

        const { ProviderRpcError, ProviderRpcErrorCode } = await import(
          "@sovryn/onboard-common"
        );

        const { default: WalletConnect } = await import(
          "@walletconnect/client"
        );

        // This is a cjs module and therefor depending on build tooling
        // sometimes it will be nested in the { default } object and
        // other times it will be the actual import
        // @ts-ignore - It thinks it is missing properties since it expect it to be nested under default
        let QRCodeModal: typeof import("@walletconnect/qrcode-modal").default =
          await import("@walletconnect/qrcode-modal");

        // @ts-ignore - TS thinks that there is no default property on the `QRCodeModal` but sometimes there is
        QRCodeModal = QRCodeModal.default || QRCodeModal;

        const { Subject, fromEvent } = await import("rxjs");
        const { takeUntil, take } = await import("rxjs/operators");

        const connector = new WalletConnect({
          bridge,
        });

        const emitter = new EventEmitter();

        class EthProvider {
          public request: EIP1193Provider["request"];
          public connector: InstanceType<typeof WalletConnect>;
          public chains: Chain[];
          public disconnect: EIP1193Provider["disconnect"];
          // @ts-ignore - TS thinks that there is no default property on the `QRCodeModal` but sometimes there is
          public emit: typeof EventEmitter["emit"];
          // @ts-ignore - TS thinks that there is no default property on the `QRCodeModal` but sometimes there is
          public on: typeof EventEmitter["on"];
          // @ts-ignore - TS thinks that there is no default property on the `QRCodeModal` but sometimes there is
          public removeListener: typeof EventEmitter["removeListener"];

          private disconnected$: InstanceType<typeof Subject>;
          private providers: Record<string, StaticJsonRpcProviderType>;

          constructor({
            connector,
            chains,
          }: {
            connector: InstanceType<typeof WalletConnect>;
            chains: Chain[];
          }) {
            this.emit = emitter.emit.bind(emitter);
            this.on = emitter.on.bind(emitter);
            this.removeListener = emitter.removeListener.bind(emitter);

            this.connector = connector;
            this.chains = chains;
            this.disconnected$ = new Subject();
            this.providers = {};

            // listen for session updates
            fromEvent(this.connector, "session_update", (error, payload) => {
              if (error) {
                throw error;
              }

              return payload;
            })
              .pipe(takeUntil(this.disconnected$))
              .subscribe({
                next: ({ params }) => {
                  const [{ accounts, chainId }] = params;
                  this.emit("accountsChanged", accounts);
                  this.emit("chainChanged", `0x${chainId.toString(16)}`);
                },
                error: console.warn,
              });

            // listen for disconnect event
            fromEvent(this.connector, "disconnect", (error, payload) => {
              if (error) {
                throw error;
              }

              return payload;
            })
              .pipe(takeUntil(this.disconnected$))
              .subscribe({
                next: () => {
                  this.emit("accountsChanged", []);
                  this.disconnected$.next(true);
                  typeof localStorage !== "undefined" &&
                    localStorage.removeItem("walletconnect");
                },
                error: console.warn,
              });

            this.disconnect = () => this.connector.killSession();

            this.request = async ({ method, params }) => {
              if (method === "eth_chainId") {
                return `0x${this.connector.chainId.toString(16)}`;
              }

              if (method === "eth_requestAccounts") {
                return new Promise<ProviderAccounts>((resolve, reject) => {
                  // Check if connection is already established
                  if (!this.connector.connected) {
                    // create new session
                    this.connector
                      .createSession(
                        connectFirstChainId
                          ? { chainId: parseInt(chains[0].id, 16) }
                          : undefined
                      )
                      .then(() => {
                        QRCodeModal.open(
                          this.connector.uri,
                          () =>
                            reject(
                              new ProviderRpcError({
                                code: 4001,
                                message: "User rejected the request.",
                              })
                            ),
                          qrcodeModalOptions
                        );
                      });
                  } else {
                    const { accounts, chainId } = this.connector.session;
                    this.emit("chainChanged", `0x${chainId.toString(16)}`);
                    return resolve(accounts);
                  }

                  // Subscribe to connection events
                  fromEvent(this.connector, "connect", (error, payload) => {
                    if (error) {
                      throw error;
                    }

                    return payload;
                  })
                    .pipe(take(1))
                    .subscribe({
                      next: ({ params }) => {
                        const [{ accounts, chainId }] = params;
                        this.emit("accountsChanged", accounts);
                        this.emit("chainChanged", `0x${chainId.toString(16)}`);
                        QRCodeModal.close();
                        resolve(accounts);
                      },
                      error: reject,
                    });
                });
              }

              if (
                method === "wallet_switchEthereumChain" ||
                method === "eth_selectAccounts"
              ) {
                throw new ProviderRpcError({
                  code: ProviderRpcErrorCode.UNSUPPORTED_METHOD,
                  message: `The Provider does not support the requested method: ${method}`,
                });
              }

              // @ts-ignore
              if (method === "eth_sendTransaction") {
                // @ts-ignore
                return this.connector.sendTransaction(params[0]);
              }

              // @ts-ignore
              if (method === "eth_signTransaction") {
                // @ts-ignore
                return this.connector.signTransaction(params[0]);
              }

              // @ts-ignore
              if (method === "personal_sign") {
                // @ts-ignore
                return this.connector.signPersonalMessage(params);
              }

              // @ts-ignore
              if (method === "eth_sign") {
                // @ts-ignore
                return this.connector.signMessage(params);
              }

              // @ts-ignore
              if (method === "eth_signTypedData") {
                // @ts-ignore
                return this.connector.signTypedData(params);
              }

              if (method === "eth_signTypedData_v4") {
                // @ts-ignore
                return this.connector.signTypedData(params);
              }

              if (method === "eth_accounts") {
                return this.connector.sendCustomRequest({
                  id: 1337,
                  jsonrpc: "2.0",
                  method,
                  params,
                });
              }

              const chainId = await this.request({ method: "eth_chainId" });

              if (!this.providers[chainId]) {
                const currentChain = chains.find(({ id }) => id === chainId);

                if (!currentChain) {
                  throw new ProviderRpcError({
                    code: ProviderRpcErrorCode.CHAIN_NOT_ADDED,
                    message: `The Provider does not have a rpcUrl to make a request for the requested method: ${method}`,
                  });
                }

                this.providers[chainId] = new StaticJsonRpcProvider(
                  currentChain.rpcUrl
                );
              }

              return this.providers[chainId].send(
                method,
                // @ts-ignore
                params
              );
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
