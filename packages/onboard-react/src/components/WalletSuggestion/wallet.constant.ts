import exodus from '@sovryn/onboard-injected/src/icons/exodus';

const WALLETS = {
  Exodus: {
    title: 'Exodus',
    link: 'https://exodus.io',
    icon: exodus,
  },
  Defiant: {
    title: 'Defiant',
    link: 'https://defiantapp.tech',
    icon: exodus,
  },
};

export const desktopWallets = [WALLETS.Exodus];

export const mobileWallets = [WALLETS.Defiant, WALLETS.Exodus];
