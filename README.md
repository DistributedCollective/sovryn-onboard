# Sovryn Onboard

Library which allows dapp users to connect with their wallets to sign messages and transactions.

Modules compatible with web3-onboard as it's mostly clones with additional features required by Sovryn.

## Installation

`yarn install @sovryn/onboard-core @sovryn/onboard-injected @sovryn/onboard-walletconnect @sovryn/onboard-react`

## Usage

```tsx
import Onboard from "@sovryn/onboard-core";
import { OnboardProvider } from "@sovryn/onboard-react";
import injectedModule from "@sovryn/onboard-injected";
import walletConnectModule from "@sovryn/onboard-walletconnect";

const injected = injectedModule();
const walletConnect = walletConnectModule();

const chains = [{}];

const onboard = Onboard({
  wallets: [injected, walletConnect],
  chains: [
    {
      id: "0x1e",
      rpcUrl: "https://public-node.rsk.co",
      label: "RSK",
      token: "RBTC",
      blockExplorerUrl: "https://explorer.rsk.co",
    },
  ],
});

const App = () => {
  return (
    <>
      <button onClick={onboard.connectWallet}>Connect</button>
      <OnboardProvider onboard={onboard} />
    </>
  );
};
```

## API

`onboard.connectWallet(wallet?: string)` - if wallet arg is given user will be connected to the wallet module without UI interaction, if wallet arg not provided - UI flow will be triggered for user to select wallet.
User can connect as many wallets as supported as long as each wallet type are different.
Returns Promise with list of connected wallets.

`onboard.disconnectWallet(wallet?: string)` - if wallet arg is given user will be disconnected from that wallet, if not - from all wallets.

`onboard.setChain(chainId: string, chainNamespace?: string, wallet?: string)` - trigger network change if wallet supports it. If wallet name given - change it to that wallet, if not - to the first wallet user connected.

`onboard.state.get()` - get state of onboard storage

`onboard.state.get().wallets` - get list of connected wallets, access provider of default wallet like this `onboard.state.get().wallets[0].provider`

`onboard.state.select('wallets').subscribe(changes => console.log(changes))` - watch for connected wallet changes
