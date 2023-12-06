import { FC, useCallback, useMemo, useState } from 'react';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { WalletModule } from '@sovryn/onboard-common';
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
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import BrowserIcon from '../../../../assets/Browser';
import HardwareIcon from '../../../../assets/HardwareWallet';
import WalletConnectIcon from '../../../../assets/WalletConnect';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { useSubscription } from '../../../../hooks/useSubscription';
import { formatDataPrefix } from '../../../../utils';
import { ButtonBack } from '../../../ButtonBack/ButtonBack';
import { HardwareWallets } from '../../../HardwareWallets/HardwareWallets';
import { WalletConnect } from '../../../WalletConnect/WalletConnect';
import { FilterType, WalletList } from '../../../WalletList/WalletList';
import { WalletSuggestion } from '../../../WalletSuggestion/WalletSuggestion';
import styles from '../../WalletDialog.module.css';

type WalletDialogContentProps = {
  dataAttribute?: string;
  walletModules: WalletModule[];
  onClose: () => void;
};

export const WalletDialogContent: FC<WalletDialogContentProps> = ({
  dataAttribute,
  walletModules,
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

  const handleNoWallet = useCallback(() => onChangeIndex(3), [onChangeIndex]);
  const handleWalletConnect = useCallback(
    () => onChangeIndex(2),
    [onChangeIndex],
  );

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
  const items: VerticalTabsItem[] = useMemo(() => {
    let hasWC,
      hasLedger,
      hasTrezor = false;
    walletModules.forEach(item => {
      switch (item.label) {
        case 'WalletConnect':
          hasWC = true;
          break;
        case 'Ledger':
          hasLedger = true;
          break;
        case 'Trezor':
          hasTrezor = true;
          break;
        default:
          break;
      }
    });
    let list: VerticalTabsItem[] = [];

    if (hasLedger || hasTrezor) {
      list.push({
        label: t('wallets.hardware.title'),
        content: (
          <>
            {isMobile && !inProgress && buttonBack}
            {isMobile && (
              <Paragraph
                size={ParagraphSize.base}
                className={styles.hardwareInfo}
              >
                {t('wallets.hardware.info')}
              </Paragraph>
            )}
            <HardwareWallets dataAttribute={dataPrefix} />
          </>
        ),
        dataAttribute: `${dataPrefix}hardware`,
        icon: <div dangerouslySetInnerHTML={{ __html: HardwareIcon }} />,
        className: styles.walletTab,
      });
    }
    list.push({
      label: t('wallets.browser.title'),
      infoText: t('wallets.browser.info'),
      content: (
        <>
          {isMobile && buttonBack}
          <WalletList
            filter={FilterType.browser}
            dataAttribute={dataPrefix}
            handleNoWallet={handleNoWallet}
            handleWalletConnect={handleWalletConnect}
          />
          {!isMobile && (
            <Paragraph className={styles.info}>
              {t('wallets.browser.extra')}
            </Paragraph>
          )}
        </>
      ),
      dataAttribute: `${dataPrefix}browser`,
      icon: <div dangerouslySetInnerHTML={{ __html: BrowserIcon }} />,
      className: styles.walletTab,
    });

    if (hasWC) {
      list.push({
        label: t('wallets.walletConnect.title'),
        infoText: t('wallets.walletConnect.info'),
        content: (
          <>
            {isMobile && buttonBack}
            <WalletConnect />
          </>
        ),
        dataAttribute: `${dataPrefix}walletConnect`,
        icon: <div dangerouslySetInnerHTML={{ __html: WalletConnectIcon }} />,
        className: styles.walletTab,
      });
    }
    list.push({
      label: t('wallets.noWallet.title'),
      content: (
        <>
          {isMobile && buttonBack}
          <WalletSuggestion />
        </>
      ),
      dataAttribute: `${dataPrefix}instructions`,
      className: classNames(styles.noWallet, styles.walletTab),
    });
    return list;
  }, [
    t,
    isMobile,
    inProgress,
    buttonBack,
    dataPrefix,
    handleNoWallet,
    handleWalletConnect,
    walletModules,
  ]);

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
