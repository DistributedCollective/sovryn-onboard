import { FC, useCallback, useEffect, useRef } from 'react';

import { WalletContainer } from '@sovryn/ui';

import WalletConnectIcon from '../../assets/WalletConnect';
import { loadAndConnectToModule } from '../../utils';
import styles from './WalletConnect.module.css';

export const WalletConnect: FC = () => {
  const ref = useRef(false);

  const connect = useCallback(
    () => loadAndConnectToModule('WalletConnect'),
    [],
  );

  useEffect(() => {
    if (connect && !ref.current) {
      ref.current = true;
      connect();
    }
  }, [connect]);

  return (
    <WalletContainer
      name="Connect WalletConnect"
      onClick={connect}
      icon={
        <div
          className={styles.icon}
          dangerouslySetInnerHTML={{ __html: WalletConnectIcon }}
        />
      }
    />
  );
};
