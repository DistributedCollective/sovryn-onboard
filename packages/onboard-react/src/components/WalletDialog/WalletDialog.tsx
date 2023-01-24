import React, { FC, useCallback } from 'react';

import { connectWallet$ } from '@sovryn/onboard-core/dist/streams';
import { Dialog, DialogSize } from '@sovryn/ui';

import styles from './WalletDialog.module.css';
import { WalletDialogContent } from './components/WalletDialogContent/WalletDialogContent';

type WalletDialogProps = {
  isOpen: boolean;
  dataAttribute?: string;
};

const WalletDialog: FC<WalletDialogProps> = ({ isOpen, dataAttribute }) => {
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
      className={styles.dialog}
      buttonCloseText={'Close'}
      dataAttribute={dataAttribute}
    >
      <WalletDialogContent
        dataAttribute={dataAttribute}
        onClose={handleCloseClick}
      />
    </Dialog>
  );
};

export default WalletDialog;
