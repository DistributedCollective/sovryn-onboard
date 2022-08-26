import type { Chain, ChainWithDecimalId } from "@sovryn/onboard-common";

export const toHexString = (val: number | string): string =>
  typeof val === "number" ? `0x${val.toString(16)}` : val;

export function chainIdToHex(chains: Chain[] | ChainWithDecimalId[]): Chain[] {
  return chains.map(({ id, ...rest }) => {
    const hexId = toHexString(id);
    return { id: hexId, ...rest };
  });
}

export const notNullish = <T>(value: T | null | undefined): value is T =>
  value != null;

export const wait = (time: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, time));
