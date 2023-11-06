import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { shareReplay, startWith } from 'rxjs/operators';

import { WalletModule } from '@sovryn/onboard-common';
import { state, helpers } from '@sovryn/onboard-core';
import { WalletContainer } from '@sovryn/ui';

import { useGetNormalizedError } from '../../hooks/useGetNormalizedError';
import { useObservable } from '../../hooks/useObservable';
import { loadAndConnectToModule, slugify } from '../../utils';
import { NoWallet } from '../NoWallet/NoWallet';
import styles from './WalletList.module.css';

export enum FilterType {
  hardware,
  browser,
}

export type WalletListProps = {
  filter: FilterType;
  dataAttribute?: string;
  handleNoWallet?: () => void;
  handleWalletConnect?: () => void;
  className?: string;
};

export const WalletList: FC<WalletListProps> = ({
  filter,
  dataAttribute,
  handleNoWallet,
  handleWalletConnect,
}) => {
  const { hasUserDeclinedTx, normalizedError } = useGetNormalizedError();

  const connectedWallets = useObservable(
    state
      .select('wallets')
      .pipe(startWith(state.get().wallets), shareReplay(1)),
    state.get().wallets,
  );

  const [walletModules, setWalletModules] = useState<WalletModule[]>([]);

  useEffect(() => {
    const sub = state
      .select('walletModules')
      .pipe(startWith(state.get().walletModules), shareReplay(1))
      .subscribe(async modules => {
        const wallets = await Promise.all(
          modules.map(async module => {
            const loadedIcon = await module.getIcon();
            return {
              ...module,
              loadedIcon,
            };
          }),
        );
        setWalletModules(wallets);
      });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  const items = useMemo(() => {
    return walletModules
      .filter(
        filter === FilterType.hardware
          ? item => helpers.isHardwareWallet(item.label)
          : item =>
              !helpers.isHardwareWallet(item.label) &&
              item.label !== 'WalletConnect',
      )
      .map(module => {
        return {
          module,
          // @ts-ignore
          icon: module.loadedIcon,
          isSelected:
            connectedWallets.find(wallet => wallet.label === module.label) !==
            undefined,
        };
      });
  }, [walletModules, connectedWallets, filter]);

  const handleOnClick = useCallback(
    (label: string) => () => loadAndConnectToModule(label),
    [],
  );
  if (items.length === 0) {
    return (
      <NoWallet
        handleNoWallet={handleNoWallet}
        handleWalletConnect={handleWalletConnect}
      />
    );
  }
  return (
    <div className={styles.container}>
      {items.map(({ module, icon, isSelected }) => (
        <WalletContainer
          key={module.label}
          name={`${module.label}${isSelected ? ' (Connected)' : ''}`}
          className={styles.item}
          disabled={isSelected}
          onClick={handleOnClick(module.label)}
          dataAttribute={`${dataAttribute}${slugify(module.label)}`}
          icon={
            <div
              className={styles.icon}
              dangerouslySetInnerHTML={{ __html: icon }}
            />
          }
        />
      ))}

      {(hasUserDeclinedTx || normalizedError) && (
        <div className={styles.error}>{normalizedError}</div>
      )}
    </div>
  );
};
