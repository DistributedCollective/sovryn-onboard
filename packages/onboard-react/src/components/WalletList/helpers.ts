const HARDWARE_WALLETS = ['trezor', 'ledger'];

export const isHardwareWallet = (wallet: string) =>
  HARDWARE_WALLETS.includes(wallet.toLowerCase());
