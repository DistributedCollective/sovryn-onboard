# sovryn-onboard docs

## Packages

Packages that can be used to integrate sovryn onboard into your project

### Core

|package|description|
|---|---|
|[`@sovryn/onboard-core`](./packages/core)|core package, required to use sovryn onboard|
|[`@sovryn/onboard-common`](./packages/common)|common Web3 provider logic and typings|
|[`@sovryn/onboard-hw-common`](./packages/hw-common)|common provider logic for Hardware wallets (Trezor, Ledger)|
|[`@sovryn/onboard-react`](./packages/onboard-react)|React UI component|

### Connectors

At least one connector is required to use sovryn onboard

|package|description|
|---|---|
|[`@sovryn/onboard-injected`](./packages/injected)|connector for injected Web3 wallets|
|[`@sovryn/onboard-walletconnect`](./packages/walletconnect)|connector for WalletConnect|
|[`@sovryn/onboard-ledger`](./packages/ledger)|connector for Ledger Hardware wallet|
|[`@sovryn/onboard-trezor`](./packages/trezor)|connector for Trezor Hardware wallet|

## Installation

To start using sovryn onboard, install the core package and at least one connector

```bash
# install core package and injected wallet connector (for Metamask, Nifty, etc)
yarn add @sovryn/onboard-core @sovryn/onboard-injected
```

Additionally, if direct integration with a hardware wallet is required, install the corresponding connector

```bash
# install ledger and trezor connectors
yarn add @sovryn/onboard-ledger @sovryn/onboard-trezor
```

We also recommend installing the React UI component which provides a simple flow for connecting to a wallet. If you are not using React or want to implement your own UI, you can skip this step, but you should check on `@sovryn/onboard-react` package for examples of how to use the core package.

```bash
# install React UI component
yarn add @sovryn/onboard-react
```

## Usage

As a first step you will need to initialize the core package and at least one connector. The core package is initialized with a list of connectors and a list of chains. The connectors are used to connect to a wallet, and the chains are used to determine which chains are supported by the wallet.

```ts
import Onboard from '@sovryn/onboard-core';
import injectedModule from '@sovryn/onboard-injected';
import { OnboardProvider } from '@sovryn/onboard-react';
import walletConnectModule from '@sovryn/onboard-walletconnect';

const injected = injectedModule();
const walletConnect = walletConnectModule();

const chains = [
  {
    id: '0x1e',
    rpcUrl: 'https://public-node.rsk.co',
    label: 'RSK',
    token: 'RBTC',
    blockExplorerUrl: 'https://explorer.rsk.co',
  },
];

export const onboard = Onboard({
  wallets: [injected, walletConnect],
  chains,
});
```

If you are using the React UI component, you will to add the `OnboardProvider` to your app. The `OnboardProvider` will provide the core package to the React UI component.

```tsx
import { OnboardProvider } from '@sovryn/onboard-react';

const App = () => {
  return (
    <>
      <MyApp />
      <OnboardProvider />
    </>
  )
}
```

Once the core package is initialized, you can use it to connect to a wallet. The `connectWallet` function will open a modal that allows the user to select a wallet and connect to it. The `disconnectWallet` function will disconnect the user from the wallet.

```ts
import { onboard } from './onboard';

const connectWallet = async () => {
  await onboard.connectWallet();
};

const disconnectWallet = async () => {
  await onboard.disconnectWallet();
};
```

If you are not using the React UI component, `connectWallet` will not show a model. For this reason you should pass a connectors name to `connectWallet` - this will allow you to connect to a specific wallet without showing a modal.
Because of this, some wallets, like Hardware wallets, will not work without the React UI component.

```ts
import { onboard } from './onboard';

const connectWallet = async () => {
  await onboard.connectWallet('injected');
};
```

`connectWallet` returns a Promise with array of `Wallet` objects. Each `Wallet` object contains information about the wallet that was connected to. The `Wallet` object also contains a `provider` property which is a Web3 provider that can be used to interact with the wallet.

```ts
import { onboard } from './onboard';

const connectWallet = async () => {
  const wallets = await onboard.connectWallet();
  const wallet = wallets[0];
  const provider = wallet.provider;
};
```

You can also retrieve onboard state by calling `onboard.state.get()`. It allows you to get the current state of the wallet, including the `wallet` object, the `address` of the connected wallet, and the `provider` that the wallet is connected to. Subscribing to state changes is also possible by calling `onboard.state.select('wallets').subscribe`.

```ts
import { onboard } from './onboard';

const wallets = onboard.state.get().wallets;
console.log('initial wallets', wallets);

const wallets = onboard.state.select('wallets').subscribe((wallets) => {
  console.log('wallets changed', wallets);
});
```

### Changing chain

To change the chain, you can call `onboard.setChain`. If wallet does not support changing chains, it will do nothing.

setChain will only allow you to change to a chain that was passed to the core package when it was initialized.

```ts
import { onboard } from './onboard';

const changeChain = async () => {
  await onboard.setChain('0x1e');
};
```

If user is connected to multiple wallets, `setChain` will change the chain for the first of them. If you want to change the chain for a specific wallet, you can pass the wallet name to `setChain`. This is useful for cross-chain flows, like bridges.

```ts
import { onboard } from './onboard';

const changeChain = async () => {
  await onboard.setChain('0x1e', undefined, 'ledger');
};
```


## Custom Connectors

You can easily implement new custom connectors. A connector is a function that returns a `WalletInit` function. 

In this example we will create a custom connector that will connect to a wallet that is injected into the page via `window.ethereum`. A simpler version of 'injected' connector.

```ts
// custom.ts
const customConnector = (): WalletInit => {
  return () => {
    label: 'Custom Wallet',
    getIcon: async () => 'https://example.com/icon.png',
    getInterface: async () => {
      return {
        provider: window.ethereum,
      };
    };
  };
};
```

export default customConnector;


## Custom UI

To implement UI library you will need to watch events from the core package. Simple example of custom UI implementation:

```ts
import { helpers, state } from '@sovryn/onboard-core';
import { connectWallet$ } from '@sovryn/onboard-core/dist/streams';


// get all connector modules that was passed to the initialization
// you can use it to get connector icon, name, etc
const modules = state.get().walletModules;

const connect = (label: string) => {
  const connector = modules.find((m) => m.label === label);
  helpers.connectWallet(connector);
};

// watch for connectWallet$ event
// it notifies about `connectWallet` function call
$connectWallet$.asObservable().subscribe((value) => {
  

  // if module is passed, it means that `connectWallet` was called with a specific wallet name and we should connect to it.
  // we can skip showing ui and connect to wallet right away
  if (value.module) {
    connect(value.module);
  }

  // inProgress means that onboard waits for user to select wallet and finish connection
  if (value.inProgress) {
    // show list of possible wallets
  } else {
    // hide list of possible wallets
  }

});
```
