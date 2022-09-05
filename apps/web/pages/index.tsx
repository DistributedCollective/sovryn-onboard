import { useCallback, useEffect, useState } from "react";
import { WalletState } from "@sovryn/onboard-core";
import { OnboardProvider } from "@sovryn/onboard-react";
import { onboard } from "../lib/connector";
import { Wallet } from "../components/Wallet";

export default function Web() {
  const handleConnectClick = useCallback(() => {
    onboard.connectWallet();
  }, []);

  const [wallets, setWallets] = useState<WalletState[]>([]);

  useEffect(() => {
    const sub = onboard.state.select("wallets").subscribe(setWallets);
    return () => sub.unsubscribe();
  }, []);

  return (
    <div>
      <h1>Connection Example</h1>

      <div>
        <button onClick={handleConnectClick}>
          {wallets.length > 0 ? "Connect another wallet" : "Connect"}
        </button>
      </div>

      {wallets.length > 0 && (
        <div>
          <h2>Connected Wallets</h2>
          {wallets.map((wallet) => (
            <Wallet wallet={wallet} key={wallet.accounts[0].address} />
          ))}
        </div>
      )}

      <OnboardProvider onboard={onboard} />
    </div>
  );
}
