import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { Paragraph, Button, ButtonStyle, ButtonType } from '@sovryn/ui';

import { useIsMobile } from '../../hooks/useIsMobile';
import styles from './NoWallet.module.css';

export type NoWalletProps = {
  handleNoWallet?: () => void;
  handleWalletConnect?: () => void;
};

export const NoWallet: FC<NoWalletProps> = ({
  handleNoWallet,
  handleWalletConnect,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useIsMobile();

  if (isMobile) {
    return (
      <div>
        <Paragraph>{t('noWallet.mobileTitle')}</Paragraph>
        <ul className={styles.list}>
          <li>
            <Paragraph>{t('noWallet.p1')}</Paragraph>
          </li>
          <li>
            <Paragraph>
              {t('noWallet.p2')}{' '}
              {handleWalletConnect && (
                <Button
                  style={ButtonStyle.ghost}
                  type={ButtonType.reset}
                  text={t('wallets.walletConnect.title')}
                  onClick={handleWalletConnect}
                />
              )}
            </Paragraph>
          </li>
          <li>
            <Paragraph>
              {t('noWallet.p3')}
              {handleNoWallet && (
                <Button
                  style={ButtonStyle.ghost}
                  type={ButtonType.reset}
                  className={styles.install}
                  text={t('noWallet.install')}
                  onClick={handleNoWallet}
                />
              )}
            </Paragraph>
          </li>
        </ul>
      </div>
    );
  }
  return (
    <div>
      <Paragraph>{t('noWallet.title')}</Paragraph>

      {handleNoWallet && (
        <Button
          style={ButtonStyle.ghost}
          type={ButtonType.reset}
          className={styles.install}
          text={t('noWallet.install')}
          onClick={handleNoWallet}
        />
      )}
    </div>
  );
};
