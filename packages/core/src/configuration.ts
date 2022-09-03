import type { Configuration } from "./types";
import { getDevice } from "./utils.js";

export let configuration: Configuration = {
  initialWalletInit: [],
  device: getDevice(),
};

export function updateConfiguration(update: Partial<Configuration>): void {
  configuration = { ...configuration, ...update };
}
