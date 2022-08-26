import { FC, useCallback, useMemo } from "react";
import { state, helpers } from "@sovryn/onboard-core";
import { shareReplay, startWith } from "rxjs/operators";
import { useSubscription } from "../hooks/useSubscription";
import { useObservable } from "../hooks/useObservable";
import { WalletModule } from "@sovryn/onboard-common";

type ConnectProps = {
  module?: string;
};

export const Connect: FC<ConnectProps> = ({ module: autoSelect }) => {
  const walletModules = useObservable(
    state
      .select("walletModules")
      .pipe(startWith(state.get().walletModules), shareReplay(1)),
    state.get().walletModules
  );
  const connectedWallets = useObservable(
    state
      .select("wallets")
      .pipe(startWith(state.get().wallets), shareReplay(1)),
    state.get().wallets
  );

  const items = useMemo(() => {
    return walletModules.map((module) => {
      return {
        module,
        isSelected:
          connectedWallets.find((wallet) => wallet.label === module.label) !==
          undefined,
      };
    });
  }, [walletModules, connectedWallets]);

  const handleOnClick = useCallback(
    (label: string) => async () => {
      console.log("clicked", label);

      const wallet = walletModules.find(
        (m) => m.label === label
      ) as WalletModule;

      if (wallet) {
        helpers.connectWallet(wallet);
      }
    },
    [walletModules]
  );

  return (
    <div
      style={{ backgroundColor: "#dedede", padding: "14px", margin: "14px" }}
    >
      <h1>Choose Wallet</h1>
      <ul>
        {items.map(({ module, isSelected }) => (
          <li key={module.label}>
            <button onClick={handleOnClick(module.label)}>
              {module.label} {isSelected && " [connected]"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
