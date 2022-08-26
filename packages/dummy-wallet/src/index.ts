import type {
  EIP1193Provider,
  GetInterfaceHelpers,
  WalletHelpers,
  WalletInit,
  WalletInterface,
  WalletModule,
} from "@sovryn/onboard-common";

export default function dummyWalletModule(): WalletInit {
  return (helpers: WalletHelpers) => ({
    label: "Test",
    getIcon: async () => "svgimageinbase64",
    getInterface: async (
      helpers: GetInterfaceHelpers
    ): Promise<WalletInterface> => {
      return {
        provider: (window as any).ethereum as EIP1193Provider,
      };
    },
  });
}
