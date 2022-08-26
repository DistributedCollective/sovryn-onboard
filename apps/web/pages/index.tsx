import { useCallback, useEffect, useState } from "react";
import { OnboardProvider } from "@sovryn/onboard-react";
import Onboard from "@sovryn/onboard-core";
import dummyModule from "@sovryn/onboard-dummy-wallet";
import { WalletState } from "@sovryn/onboard-core/dist/types";

const dummy = dummyModule();

const onboard = Onboard({
  wallets: [dummy],
  chains: [
    {
      id: "0x1e",
      rpcUrl: "https://public-node.rsk.co",
      label: "RSK",
      token: "RBTC",
    },
    {
      id: "0x1f",
      rpcUrl: "https://public-node.testnet.rsk.co",
      label: "RSK testnet",
      token: "tRBTC",
    },
  ],
});

export default function Web() {
  const handleConnectClick = useCallback(() => {
    onboard.connectWallet();
  }, []);

  const [wallets, setWallets] = useState<WalletState[]>([]);

  useEffect(() => {
    const sub = onboard.state.select("wallets").subscribe(setWallets);
    return () => sub.unsubscribe();
  }, []);

  const handleMsgSign = useCallback(
    (wallet: WalletState) => () => {
      wallet.provider
        .request({
          method: "personal_sign",
          params: ["test", wallet.accounts[0].address],
        })
        .then((result: any) => alert(result))
        .catch((error: any) => alert(error.message));
    },
    []
  );

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
          {wallets.map((wallet, index) => (
            <div key={wallet.label}>
              <div>
                #{index}: {wallet.accounts[0].address}
              </div>
              <div>
                <button onClick={handleMsgSign(wallet)}>Sign Message</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <OnboardProvider onboard={onboard} />
    </div>
  );
}