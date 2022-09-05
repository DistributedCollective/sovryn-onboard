import type { EIP1193Provider } from "@sovryn/onboard-common";
import { providers } from "ethers";

export const getSigner = (wallet: EIP1193Provider) => {
  const provider = new providers.Web3Provider(wallet);
  return provider.getSigner();
};
