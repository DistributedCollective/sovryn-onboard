import type {
  Chain,
  ChainWithDecimalId,
  Device,
  DeviceBrowser,
  DeviceOS,
  DeviceType,
} from '@sovryn/onboard-common';
import bowser from 'bowser';
import type { DeviceNotBrowser } from './types.js';

export const toHexString = (val: number | string): string =>
  typeof val === 'number' ? `0x${val.toString(16)}` : val;

export function chainIdToHex(chains: Chain[] | ChainWithDecimalId[]): Chain[] {
  return chains.map(({ id, ...rest }) => {
    const hexId = toHexString(id);
    return { id: hexId, ...rest };
  });
}

export const notNullish = <T>(value: T | null | undefined): value is T =>
  value != null;

export const wait = (time: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, time));

export function getDevice(): Device | DeviceNotBrowser {
  if (typeof window !== 'undefined') {
    const parsed = bowser.getParser(window.navigator.userAgent);
    const os = parsed.getOS();
    const browser = parsed.getBrowser();
    const { type } = parsed.getPlatform();

    return {
      type: type as DeviceType,
      os: os as DeviceOS,
      browser: browser as DeviceBrowser,
    };
  } else {
    return {
      type: null,
      os: null,
      browser: null,
    };
  }
}
