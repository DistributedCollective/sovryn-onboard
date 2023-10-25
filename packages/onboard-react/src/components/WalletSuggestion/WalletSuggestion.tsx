import { FC, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { Paragraph, Link } from '@sovryn/ui';

import { useIsMobile } from '../../hooks/useIsMobile';
import { WalletLink } from './components/WalletLink/WalletLink';
import { desktopWallets, mobileWallets } from './wallet.constant';

export const WalletSuggestion: FC = () => {
  const { t } = useTranslation();
  const { isMobile } = useIsMobile();

  const list = useMemo(() => (isMobile ? mobileWallets : desktopWallets), [
    isMobile,
  ]);

  return (
    <div>
      <Paragraph>
        {t(
          !isMobile ? 'walletSuggestion.title' : 'walletSuggestion.mobileTitle',
        )}
      </Paragraph>
      {list
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(wallet => (
          <WalletLink
            key={wallet.title}
            title={wallet.title}
            link={wallet.link}
            getIcon={wallet.getIcon}
          />
        ))}
      <Link
        text={t('walletSuggestion.guide')}
        href="https://wiki.sovryn.com/en/getting-started/wallet-setup"
        openNewTab
      />
    </div>
  );
};
