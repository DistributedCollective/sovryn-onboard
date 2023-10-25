import { FC, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { Paragraph } from '@sovryn/ui';

import { useIsMobile } from '../../hooks/useIsMobile';
import { WalletLink } from './components/WalletLink/WalletLink';
import { desktopWallets, mobileWallets } from './wallet.constant';

export const WalletSuggestion: FC = () => {
  const { t } = useTranslation();
  const { isMobile } = useIsMobile();

  const list = useMemo(
    () => (isMobile ? mobileWallets : desktopWallets),
    [isMobile],
  );

  return (
    <div>
      <Paragraph>
        {t(
          !isMobile ? 'walletSuggestion.title' : 'walletSuggestion.mobileTitle',
        )}
      </Paragraph>
      {list.map(wallet => (
        <WalletLink
          key={wallet.title}
          title={wallet.title}
          link={wallet.link}
          icon={wallet.icon}
        />
      ))}
    </div>
  );
};
