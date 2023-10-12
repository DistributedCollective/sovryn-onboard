import { FC, useCallback, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { connectWallet$ } from '@sovryn/onboard-core/dist/streams';
import { selectAccounts$ } from '@sovryn/onboard-hw-common';
import {
  VerticalTabs,
  VerticalTabsItem,
  VerticalTabsMobile,
  Button,
  ButtonStyle,
  Heading,
  HeadingType,
} from '@sovryn/ui';

import { useIsMobile } from '../../../../hooks/useIsMobile';
import { useSubscription } from '../../../../hooks/useSubscription';
import { formatDataPrefix } from '../../../../utils';
import { ButtonBack } from '../../../ButtonBack/ButtonBack';
import { HardwareWallets } from '../../../HardwareWallets/HardwareWallets';
import { InstructionsTab } from '../../../InstructionsTab/InstructionsTab';
import { FilterType, WalletList } from '../../../WalletList/WalletList';
import styles from '../../WalletDialog.module.css';

type WalletDialogContentProps = {
  dataAttribute?: string;
  onClose: () => void;
};

export const WalletDialogContent: FC<WalletDialogContentProps> = ({
  dataAttribute,
  onClose,
}) => {
  const { t } = useTranslation();
  const { inProgress } = useSubscription(selectAccounts$);
  const { isMobile } = useIsMobile();
  const [index, setIndex] = useState(0);
  const [indexMobile, setIndexMobile] = useState<null | number>(null);

  const onChangeIndex = useCallback((index: number | null) => {
    connectWallet$.next({
      inProgress: true,
      error: undefined,
    });

    index !== null ? setIndex(index) : setIndex(0);
    setIndexMobile(index);
  }, []);

  const buttonBack = useMemo(
    () => (
      <ButtonBack
        label={t('common.backToMenu')}
        onClick={() => onChangeIndex(null)}
        dataAttribute={`${dataAttribute}-back-wallet`}
      />
    ),
    [t, dataAttribute, onChangeIndex],
  );
  const dataPrefix = formatDataPrefix(dataAttribute);
  const items: VerticalTabsItem[] = useMemo(
    () => [
      {
        label: t('wallets.hardware.title'),
        infoText: t('wallets.hardware.info'),
        content: (
          <>
            {isMobile && !inProgress && buttonBack}
            <HardwareWallets dataAttribute={dataPrefix} />
          </>
        ),
        dataAttribute: `${dataPrefix}hardware`,
      },
      {
        label: t('wallets.browser.title'),
        infoText: t('wallets.browser.info'),
        content: (
          <>
            {isMobile && buttonBack}
            <WalletList
              filter={FilterType.browser}
              dataAttribute={dataPrefix}
            />
          </>
        ),
        dataAttribute: `${dataPrefix}browser`,
      },
      {
        label: t('wallets.noWallet.title'),
        infoText: t('wallets.noWallet.info'),
        content: (
          <>
            {isMobile && buttonBack}
            <InstructionsTab dataAttribute={dataPrefix} />
          </>
        ),
        dataAttribute: `${dataPrefix}instructions`,
      },
    ],
    [t, isMobile, inProgress, buttonBack, dataPrefix],
  );

  return (
    <>
      {isMobile ? (
        <VerticalTabsMobile
          selectedIndex={indexMobile}
          header={() => (
            <Heading type={HeadingType.h2}>{t('wallets.select')}</Heading>
          )}
          items={items}
          onChange={onChangeIndex}
          tabsClassName={styles.tabsMobile}
          className={styles.tabsContainer}
        />
      ) : (
        <VerticalTabs
          selectedIndex={index}
          onChange={onChangeIndex}
          items={items}
          className={styles.container}
          tabsClassName={styles.tabs}
          contentClassName={styles.content}
          header={() => <Heading>{t('wallets.connectWallet')}</Heading>}
          footer={() => (
            <Button
              text={t('common.close')}
              onClick={onClose}
              style={ButtonStyle.ghost}
              dataAttribute={`${dataAttribute}-close`}
            />
          )}
        />
      )}
    </>
  );
};
