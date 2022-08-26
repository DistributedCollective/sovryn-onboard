import type { Configuration } from "./types";

export let configuration: Configuration = {
  initialWalletInit: [],
  device: null,
};

export function updateConfiguration(update: Partial<Configuration>): void {
  configuration = { ...configuration, ...update };
}
