import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { shareReplay, startWith } from 'rxjs';

import { WalletModule } from '@sovryn/onboard-common';
import { state } from '@sovryn/onboard-core';
import { connectWallet$ } from '@sovryn/onboard-core/dist/streams';
import { selectAccounts$ } from '@sovryn/onboard-hw-common';
import { Dialog, DialogSize } from '@sovryn/ui';

import { useSubscription } from '../../hooks/useSubscription';
import styles from './WalletDialog.module.css';
import { WalletDialogContent } from './components/WalletDialogContent/WalletDialogContent';

type WalletDialogProps = {
  isOpen: boolean;
  dataAttribute?: string;
};

const WalletDialog: FC<WalletDialogProps> = ({ isOpen, dataAttribute }) => {
  const { module } = useSubscription(connectWallet$);
  const { inProgress } = useSubscription(selectAccounts$);
  const { t } = useTranslation();

  const invisible = useMemo(
    () => (!!module && !inProgress) || !isOpen,
    [module, inProgress, isOpen],
  );

  const handleCloseClick = useCallback(() => {
    connectWallet$.next({
      inProgress: false,
    });
  }, []);

  const [walletModules, setWalletModules] = useState<WalletModule[]>([]);

  useEffect(() => {
    const sub = state
      .select('walletModules')
      .pipe(startWith(state.get().walletModules), shareReplay(1))
      .subscribe(async modules => {
        setWalletModules(modules);
      });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleCloseClick}
      closeOnEscape
      width={DialogSize.xl2}
      disableFocusTrap
      className={classNames(styles.dialog, {
        [styles.invisibleDialog]: invisible,
      })}
      overlayProps={{
        className: classNames({
          [styles.invisibleDialog]: invisible,
        }),
      }}
      buttonCloseText={t('common.close')}
      dataAttribute={dataAttribute}
      initialZIndex={20}
    >
      <WalletDialogContent
        dataAttribute={dataAttribute}
        onClose={handleCloseClick}
        walletModules={walletModules}
      />
    </Dialog>
  );
};

export default WalletDialog;
