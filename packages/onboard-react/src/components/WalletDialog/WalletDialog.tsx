import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import {
  Dialog,
  VerticalTabs,
  VerticalTabsItem,
  Button,
  ButtonStyle,
  Heading,
  DialogSize,
} from "@sovryn/ui";
import { connectWallet$ } from "@sovryn/onboard-core/dist/streams";
import { closeAccountSelect, selectAccounts$ } from "@sovryn/onboard-hw-common";
import { FilterType, WalletList } from "../WalletList/WalletList";
import { InstructionsTab } from "../InstructionsTab/InstructionsTab";
import { HardwareWallets } from "../HardwareWallets/HardwareWallets";
import { useSubscription } from "../../hooks/useSubscription";
import styles from "./WalletDialog.module.css";

type WalletDialogProps = {
  isOpen: boolean;
};

const WalletDialog: FC<WalletDialogProps> = ({ isOpen }) => {
  const { inProgress } = useSubscription(selectAccounts$);
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

  useEffect(() => {
    if (index !== 0) {
      closeAccountSelect();
    }
  }, [index]);

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
        className={classNames(styles.container, {
          [styles.containerInProgress]: inProgress,
        })}
        tabsClassName={classNames(styles.tabs, {
          [styles.tabsInProgress]: inProgress,
        })}
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
