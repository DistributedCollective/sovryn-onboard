import React, { FC, useCallback, useMemo, useState } from "react";
import {
  Dialog,
  VerticalTabs,
  VerticalTabsItem,
  Button,
  ButtonStyle,
  Heading,
  DialogSize,
} from "@sovryn/ui";
import { FilterType, WalletList } from "../WalletList/WalletList";
import { connectWallet$ } from "@sovryn/onboard-core/dist/streams";
import { InstructionsTab } from "../InstructionsTab/InstructionsTab";
import styles from "./WalletDialog.module.css";
import { HardwareWallets } from "../HardwareWallets/HardwareWallets";

type WalletDialogProps = {
  isOpen: boolean;
};

const WalletDialog: FC<WalletDialogProps> = ({ isOpen }) => {
  const [index, setIndex] = useState(0);

  const items: VerticalTabsItem[] = useMemo(
    () => [
      {
        label: "Hardware Wallet",
        infoText: "Select the hardware wallet you want to connect",
        content: <HardwareWallets />,
        dataLayoutId: "hardware",
      },
      {
        label: "Browser Wallet",
        infoText: "Select the web3 wallet you want to connect",
        content: <WalletList filter={FilterType.browser} />,
        dataLayoutId: "browser",
      },
      {
        label: "Don't have a wallet?",
        infoText: "Read the following instructions",
        content: <InstructionsTab />,
        dataLayoutId: "instructions",
      },
    ],
    []
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
    >
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
    </Dialog>
  );
};

export default WalletDialog;
