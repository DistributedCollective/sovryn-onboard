import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { shareReplay, startWith } from 'rxjs/operators';

import { WalletModule } from '@sovryn/onboard-common';
import { state, helpers } from '@sovryn/onboard-core';
import { connectWallet$ } from '@sovryn/onboard-core/dist/streams';
import { WalletContainer } from '@sovryn/ui';

import { useObservable } from '../../hooks/useObservable';
import { useSubscription } from '../../hooks/useSubscription';
import { slugify } from '../../utils';
import styles from './WalletList.module.css';
import { isHardwareWallet } from './helpers';

export enum FilterType {
  hardware,
  browser,
}

export type WalletListProps = {
  filter: FilterType;
  dataAttribute?: string;
};

export const WalletList: FC<WalletListProps> = ({ filter, dataAttribute }) => {
  const { error } = useSubscription(connectWallet$);

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
          ? item => isHardwareWallet(item.label)
          : item => !isHardwareWallet(item.label),
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
    (label: string) => async () => {
      const wallet = walletModules.find(m => m.label === label) as WalletModule;

      if (wallet) {
        helpers.connectWallet(wallet);
      }
    },
    [walletModules],
  );

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

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};
