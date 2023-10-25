import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { Link } from '@sovryn/ui';

import styles from './WalletLink.module.css';

interface WalletLinkProps {
  title: string;
  link: string;
  icon: string;
}

export const WalletLink: FC<WalletLinkProps> = ({ title, link, icon }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <div
          className={styles.icon}
          dangerouslySetInnerHTML={{ __html: icon }}
        />

        {title}
      </div>
      <Link text={t('common.download')} href={link} openNewTab />
    </div>
  );
};
