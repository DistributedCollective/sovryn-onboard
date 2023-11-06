const WALLETS = {
  Enkrypt: {
    title: 'Enkrypt',
    link: 'https://www.enkrypt.com',
    getIcon: async () =>
      (await import('@sovryn/onboard-injected/dist/icons/enkrypt.js')).default,
    isNew: false,
  },
  Exodus: {
    title: 'Exodus',
    link: 'https://exodus.io',
    getIcon: async () =>
      (await import('@sovryn/onboard-injected/dist/icons/exodus.js')).default,
    isNew: true,
  },
  Frame: {
    title: 'Frame',
    link: 'https://frame.sh',
    getIcon: async () =>
      (await import('@sovryn/onboard-injected/dist/icons/frame.js')).default,
    isNew: false,
  },
  Liquality: {
    title: 'Liquality',
    link: 'https://liquality.io',
    getIcon: async () =>
      (await import('@sovryn/onboard-injected/dist/icons/liquality.js'))
        .default,
    isNew: false,
  },
  MetaMask: {
    title: 'MetaMask',
    link: 'https://metamask.io',
    getIcon: async () =>
      (await import('@sovryn/onboard-injected/dist/icons/metamask.js')).default,
    isNew: false,
  },
  Taho: {
    title: 'Taho',
    link: 'https://taho.xyz',
    getIcon: async () =>
      (await import('@sovryn/onboard-injected/dist/icons/taho.js')).default,
    isNew: false,
  },
  Defiant: {
    title: 'Defiant',
    link: 'https://defiantapp.tech',
    getIcon: async () =>
      (await import('@sovryn/onboard-injected/dist/icons/defiantwallet.js'))
        .default,
    isNew: false,
  },
  Math: {
    title: 'Math Wallet',
    link: 'https://mathwallet.org',
    getIcon: async () =>
      (await import('@sovryn/onboard-injected/dist/icons/mathwallet.js'))
        .default,
    isNew: false,
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
