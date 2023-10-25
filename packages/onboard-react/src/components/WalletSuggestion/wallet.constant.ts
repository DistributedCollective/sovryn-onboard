const WALLETS = {
  Enkrypt: {
    title: 'Enkrypt',
    link: 'https://www.enkrypt.com',
    getIcon: async () =>
      (await import('@sovryn/onboard-injected/dist/icons/enkrypt.js')).default,
  },
  Exodus: {
    title: 'Exodus',
    link: 'https://exodus.io',
    getIcon: async () =>
      (await import('@sovryn/onboard-injected/dist/icons/exodus.js')).default,
  },
  Frame: {
    title: 'Frame',
    link: 'https://frame.sh',
    getIcon: async () =>
      (await import('@sovryn/onboard-injected/dist/icons/frame.js')).default,
  },
  Liquality: {
    title: 'Liquality',
    link: 'https://liquality.io',
    getIcon: async () =>
      (await import('@sovryn/onboard-injected/dist/icons/liquality.js'))
        .default,
  },
  MetaMask: {
    title: 'MetaMask',
    link: 'https://metamask.io',
    getIcon: async () =>
      (await import('@sovryn/onboard-injected/dist/icons/metamask.js')).default,
  },
  Taho: {
    title: 'Taho',
    link: 'https://taho.xyz',
    getIcon: async () =>
      (await import('@sovryn/onboard-injected/dist/icons/taho.js')).default,
  },
  Defiant: {
    title: 'Defiant',
    link: 'https://defiantapp.tech',
    getIcon: async () =>
      (await import('@sovryn/onboard-injected/dist/icons/defiantwallet.js'))
        .default,
  },
  Math: {
    title: 'Math Wallet',
    link: 'https://mathwallet.org',
    getIcon: async () =>
      (await import('@sovryn/onboard-injected/dist/icons/mathwallet.js'))
        .default,
  },
};

export const desktopWallets = [
  WALLETS.Enkrypt,
  WALLETS.Exodus,
  WALLETS.Frame,
  WALLETS.Liquality,
  WALLETS.MetaMask,
  WALLETS.Taho,
];

export const mobileWallets = [
  WALLETS.Defiant,
  WALLETS.Exodus,
  WALLETS.Math,
  WALLETS.MetaMask,
  WALLETS.Taho,
];
