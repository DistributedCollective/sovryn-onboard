import { FC, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Link } from '@sovryn/ui';

import styles from './WalletLink.module.css';

interface WalletLinkProps {
  title: string;
  link: string;
  getIcon: () => Promise<string>;
}

export const WalletLink: FC<WalletLinkProps> = ({ title, link, getIcon }) => {
  const [icon, setIcon] = useState<string>('');
  const { t } = useTranslation();

  useEffect(() => {
    getIcon()
      .then(setIcon)
      .catch(console.log);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        {icon && (
          <div
            className={styles.icon}
            dangerouslySetInnerHTML={{ __html: icon }}
          />
        )}

        {title}
      </div>
      <Link text={t('common.download')} href={link} openNewTab />
    </div>
  );
};
