import Onboard from "@sovryn/onboard-core";
import injectedModule from "@sovryn/onboard-injected";
import ledgerModule from "@sovryn/onboard-ledger";

const injected = injectedModule();
const ledger = ledgerModule();

export const onboard = Onboard({
  wallets: [injected, ledger],
  chains: [
    {
      id: "0x1",
      rpcUrl: "https://cloudflare-eth.com/v1/mainnet",
      label: "Ethereum Mainnet",
      token: "ETH",
      blockExplorerUrl: "https://etherscan.io",
    },
    {
      id: "0x1e",
      rpcUrl: "https://public-node.rsk.co",
      label: "RSK",
      token: "RBTC",
      blockExplorerUrl: "https://explorer.rsk.co",
    },
    {
      id: "0x1f",
      rpcUrl: "https://public-node.testnet.rsk.co",
      label: "RSK testnet",
      token: "tRBTC",
      blockExplorerUrl: "https://explorer.testnet.rsk.co",
    },
  ],
});
