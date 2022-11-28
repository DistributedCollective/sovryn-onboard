import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import Bowser from "bowser";
import {
  Dialog,
  VerticalTabs,
  VerticalTabsItem,
  VerticalTabsMobile,
  Button,
  ButtonStyle,
  Heading,
  DialogSize,
} from "@sovryn/ui";
import { connectWallet$ } from "@sovryn/onboard-core/dist/streams";
import { FilterType, WalletList } from "../WalletList/WalletList";
import { InstructionsTab } from "../InstructionsTab/InstructionsTab";
import { HardwareWallets } from "../HardwareWallets/HardwareWallets";
import styles from "./WalletDialog.module.css";
import { PlatformTypeProps, WalletDialogProps } from "./WalletDialog.types";
import { ButtonBack } from "./ButtonBack";

const WalletDialog: FC<WalletDialogProps> = ({ isOpen }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [index, setIndex] = useState(0);
  const [indexMobile, setIndexMobile] = useState<null | number>(null);

  const getPlatformType = useCallback(() => {
    const platformType = Bowser.getParser(
      window.navigator.userAgent
    ).getPlatformType() as PlatformTypeProps;
    return platformType === PlatformTypeProps.mobile
      ? setIsMobile(true)
      : setIsMobile(false);
  }, []);

  const buttonBack = useMemo(
    () => (
      <ButtonBack
        label="Back to wallet menu"
        onClick={() => setIndexMobile(null)}
      />
    ),
    []
  );

  useEffect(() => {
    getPlatformType();
    window.addEventListener("resize", getPlatformType);

    return () => {
      window.removeEventListener("resize", getPlatformType);
    };
  }, [getPlatformType]);

  const items: VerticalTabsItem[] = useMemo(
    () => [
      {
        label: "Hardware Wallet",
        infoText: "Select the hardware wallet you want to connect",
        content: (
          <>
            {isMobile && buttonBack}
            <HardwareWallets />
          </>
        ),
        dataLayoutId: "hardware",
      },
      {
        label: "Browser Wallet",
        infoText: "Select the web3 wallet you want to connect",
        content: (
          <>
            {isMobile && buttonBack}
            <WalletList filter={FilterType.browser} />
          </>
        ),
        dataLayoutId: "browser",
      },
      {
        label: "Don't have a wallet?",
        infoText: "Read the following instructions",
        content: (
          <>
            {isMobile && buttonBack}
            <InstructionsTab />
          </>
        ),
        dataLayoutId: "instructions",
      },
    ],
    [isMobile, buttonBack]
  );

  const handleCloseClick = useCallback(() => {
    connectWallet$.next({
      inProgress: false,
    });
  }, []);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleCloseClick}
      closeOnEscape
      width={DialogSize.xl2}
      disableFocusTrap
    >
      {isMobile ? (
        <VerticalTabsMobile
          selectedIndex={indexMobile}
          header={() => <Heading>Connect Wallet</Heading>}
          items={items}
          onChange={setIndexMobile}
          tabsClassName={styles.tabsMobile}
        />
      ) : (
        <VerticalTabs
          selectedIndex={index}
          onChange={setIndex}
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
            />
          )}
        />
      )}
    </Dialog>
  );
};

export default WalletDialog;
