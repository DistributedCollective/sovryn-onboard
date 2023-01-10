import React, { FC, useCallback, useMemo, useState } from 'react';

import { connectWallet$ } from '@sovryn/onboard-core/dist/streams';
import { selectAccounts$ } from '@sovryn/onboard-hw-common';
import {
  Dialog,
  VerticalTabs,
  VerticalTabsItem,
  VerticalTabsMobile,
  Button,
  ButtonStyle,
  Heading,
  DialogSize,
  HeadingType,
} from '@sovryn/ui';

import { useIsMobile } from '../../hooks/useIsMobile';
import { useSubscription } from '../../hooks/useSubscription';
import { ButtonBack } from '../ButtonBack/ButtonBack';
import { HardwareWallets } from '../HardwareWallets/HardwareWallets';
import { InstructionsTab } from '../InstructionsTab/InstructionsTab';
import { FilterType, WalletList } from '../WalletList/WalletList';
import styles from './WalletDialog.module.css';

type WalletDialogProps = {
  isOpen: boolean;
  dataAttribute?: string;
};

const WalletDialog: FC<WalletDialogProps> = ({ isOpen, dataAttribute }) => {
  const { inProgress } = useSubscription(selectAccounts$);
  const { isMobile } = useIsMobile();
  const [index, setIndex] = useState(0);
  const [indexMobile, setIndexMobile] = useState<null | number>(null);

  const onChangeIndex = useCallback((index: number | null) => {
    index !== null ? setIndex(index) : setIndex(0);
    setIndexMobile(index);
  }, []);

  const buttonBack = useMemo(
    () => (
      <ButtonBack
        label="Back to wallet menu"
        onClick={() => onChangeIndex(null)}
      />
    ),
    [onChangeIndex],
  );
  const dataPrefix = dataAttribute ?? '';
  const items: VerticalTabsItem[] = useMemo(
    () => [
      {
        label: 'Hardware Wallet',
        infoText: 'Select the hardware wallet you want to connect',
        content: (
          <>
            {isMobile && !inProgress && buttonBack}
            <HardwareWallets dataAttribute={dataPrefix} />
          </>
        ),
        dataAttribute: `${dataPrefix}-hardware`,
      },
      {
        label: 'Browser Wallet',
        infoText: 'Select the web3 wallet you want to connect',
        content: (
          <>
            {isMobile && buttonBack}
            <WalletList
              filter={FilterType.browser}
              dataAttribute={dataPrefix}
            />
          </>
        ),
        dataAttribute: `${dataPrefix}-browser`,
      },
      {
        label: "Don't have a wallet?",
        infoText: 'Read the following instructions',
        content: (
          <>
            {isMobile && buttonBack}
            <InstructionsTab dataAttribute={dataPrefix} />
          </>
        ),
        dataAttribute: `${dataPrefix}-instructions`,
      },
    ],
    [dataPrefix, isMobile, inProgress, buttonBack],
  );

  const handleCloseClick = useCallback(() => {
    connectWallet$.next({
      inProgress: false,
    });
  }, []);
  console.log(items);
  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleCloseClick}
      closeOnEscape
      width={DialogSize.xl2}
      disableFocusTrap
      className={styles.dialog}
      buttonCloseText={'Close'}
      dataAttribute={dataAttribute}
    >
      {isMobile ? (
        <VerticalTabsMobile
          selectedIndex={indexMobile}
          header={() => (
            <Heading type={HeadingType.h2}>
              Select the type of wallet you have
            </Heading>
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
          header={() => <Heading>Connect Wallet</Heading>}
          footer={() => (
            <Button
              text="Close"
              onClick={handleCloseClick}
              style={ButtonStyle.ghost}
              dataAttribute={`${dataAttribute}-close`}
            />
          )}
        />
      )}
    </Dialog>
  );
};

export default WalletDialog;
