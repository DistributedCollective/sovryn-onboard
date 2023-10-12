import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { Link, Paragraph } from '@sovryn/ui';

import { formatDataPrefix } from '../../utils';
import styles from './InstructionsTab.module.css';

type InstructionsTabProps = {
  dataAttribute?: string;
};

export const InstructionsTab: FC<InstructionsTabProps> = ({
  dataAttribute,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <div className={styles.text}>
        <Paragraph>{t('instructionsTab.title')}</Paragraph>
        <Paragraph>{t('instructionsTab.p1')}</Paragraph>
        <Paragraph>{t('instructionsTab.p2')}</Paragraph>
        <Paragraph>{t('instructionsTab.p3')} </Paragraph>
      </div>

      <Link
        href="https://wiki.sovryn.app/en/getting-started/wallet-setup"
        text={t('instructionsTab.getWallet')}
        className={styles.link}
        dataAttribute={`${formatDataPrefix(dataAttribute)}instruction-link`}
      />
    </>
  );
};
