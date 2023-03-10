[GitHub](https://github.com/DistributedCollective) | [Wiki](https://wiki.sovryn.com/en/home) | [Forum](https://forum.sovryn.app/) | [Blog](https://sovryn.com/all-things-sovryn/) | [LinkedIn](https://www.linkedin.com/company/sovryn/about/) | [Twitter](https://twitter.com/SovrynBTC) | [Discord](https://discord.gg/kBTNx4zjRf)

# Sovryn Onboard

---

## What's inside?

Library which allows dapp users to connect with their Web3 wallets to sign messages and transactions.

Modules are forked from and therefore compatible with [web3-onboard](https://github.com/blocknative/web3-onboard), most changes are to add additional features required by Sovryn.

### Apps and Packages

- `apps/web`: small test application with an example implementation of `@sovryn/onboard-react`
- `@sovryn/onboard-common`: common Web3 provider logic and typings
- `@sovryn/onboard-core`: core functions and entrypoints to other specific provider packages
- `@sovryn/onboard-hw-common`: common provider logic for Hardware wallets (Trezor, Ledger)
- `@sovryn/onboard-injected`: provider logic for injected Web3 wallets
- `@sovryn/onboard-ledger`: provider logic for Ledger Hardware wallet
- `@sovryn/onboard-react`: React UI component
- `@sovryn/onboard-trezor`: provider logic for Trezor Hardware wallet
- `@sovryn/onboard-tsconfig`: shared `tsconfig` used in all onboard packages
- `@sovryn/onboard-walletconnect`: provider logic for WalletConnect wallets

## Installation

`yarn install @sovryn/onboard-core @sovryn/onboard-injected @sovryn/onboard-walletconnect @sovryn/onboard-react`

## Development

### Example Usage

```tsx
import Onboard from '@sovryn/onboard-core';
import injectedModule from '@sovryn/onboard-injected';
import { OnboardProvider } from '@sovryn/onboard-react';
import walletConnectModule from '@sovryn/onboard-walletconnect';

const injected = injectedModule();
const walletConnect = walletConnectModule();

const chains = [{}];

const onboard = Onboard({
  wallets: [injected, walletConnect],
  chains: [
    {
      id: '0x1e',
      rpcUrl: 'https://public-node.rsk.co',
      label: 'RSK',
      token: 'RBTC',
      blockExplorerUrl: 'https://explorer.rsk.co',
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

A full working example of Sovryn Onboard usage can be found in the [Sovryn dapp repo](https://github.com/DistributedCollective/sovryn-dapp).

## API

`onboard.connectWallet(wallet?: string)` - if wallet arg is given user will be connected to the wallet module without UI interaction, if wallet arg not provided - UI flow will be triggered for user to select wallet.
User can connect as many wallets as supported as long as each wallet type are different.
Returns Promise with list of connected wallets.

`onboard.disconnectWallet(wallet?: string)` - if wallet arg is given user will be disconnected from that wallet, if not - from all wallets.

`onboard.setChain(chainId: string, chainNamespace?: string, wallet?: string)` - trigger network change if wallet supports it. If wallet name given - change it to that wallet, if not - to the first wallet user connected.

`onboard.state.get()` - get state of onboard storage

`onboard.state.get().wallets` - get list of connected wallets, access provider of default wallet like this `onboard.state.get().wallets[0].provider`

`onboard.state.select('wallets').subscribe(changes => console.log(changes))` - watch for connected wallet changes

## Contributing

<a href="https://github.com/DistributedCollective/sovryn-onboard/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=DistributedCollective/sovryn-onboard" />
</a>

### Guidelines

Find out all about our working practices on our wiki [here](https://github.com/DistributedCollective/sovryn-dapp/wiki).

### Support Questions

Sovryn's GitHub issue trackers are not intended to provide help or support. Use one of the following channels instead:

- [Discord](https://discord.gg/kBTNx4zjRf)
- [Wiki Pages](https://wiki.sovryn.app)
- [Sovryn Forum](https://forum.sovryn.app)
- [Sovryn Blog](https://sovryn.com/all-things-sovryn)

### Bug Reports

To foster active collaboration, Sovryn strongly encourages the creation of pull requests rather than just bug reports. "Bug reports" may also be sent in the form of a pull request containing a failing test.

However, if you file a bug report, your issue should contain a title and a clear description of the issue. You should also include as much relevant information as possible. The goal of a bug report is to make it easy for yourself - and others - to replicate the bug and develop a fix.

Remember, bug reports are created in the hope that others with the same problem will be able to collaborate with you on solving it. Do not expect that the bug report will automatically see any activity or that others will jump to fix it. Creating a bug report serves to help yourself and others start on the path of fixing the problem. If you want to chip in, you can help out by fixing any bugs listed in our [issue trackers](https://github.com/issues?q=is%3Aopen+is%3Aissue+label%3Abug+user%3Adistributedcollective).

### Which Branch?

The `dev` branch acts as a testnet containing the latest changes. The `main` branch is production branch for the packages in this repository. Depending on your feature you are contributing with, select the proper branch as a starting point. Most of the time, it will be the `dev` branch unless you provide hotfixes or features that should be released before other features - then it can be `main`. By doing so, we merge all features to `dev` and then `dev` to `main` to make one big release batch, after full testing and review.

**All** bug fixes should be sent to the latest stable `main` branch. Bug fixes should never be sent to the development branch unless they fix features that exist only in the upcoming release.

**Minor** features that are fully backward compatible with the current release may be sent to the latest stable branch.

**Major** new features should always be sent to the `dev` branch, which contains the upcoming release.

Ask in the `#technical-discussion` channel of the Sovryn Discord server when unsure if the feature qualifies as major or minor.

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments. A full written version can be found [here](CODE_OF_CONDUCT.md).

## Licence

The Sovryn dapp is open-sourced software licensed under the [MIT license](LICENSE).
