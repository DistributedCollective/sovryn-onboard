/// <reference path="./custom.d.ts" />
import { FC, useEffect, useState } from 'react';

import { helpers } from '@sovryn/onboard-core';
import { connectWallet$ } from '@sovryn/onboard-core/dist/streams';

import ErrorBoundary from './components/ErrorBoundary';
import WalletDialog from './components/WalletDialog/WalletDialog';
import { loadAndConnectToModule } from './utils';

type OnboardProviderProps = {
  dataAttribute?: string;
};

export const OnboardProvider: FC<OnboardProviderProps> = ({
  dataAttribute,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sub = connectWallet$.subscribe(({ inProgress, module }) => {
      if (!inProgress) {
        setIsOpen(false);
      }

      if (module) {
        loadAndConnectToModule(module);
      }

      if (
        inProgress &&
        (!module || (module && helpers.isHardwareWallet(module)))
      ) {
        setIsOpen(true);
      }
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  return (
    <ErrorBoundary>
      <WalletDialog isOpen={isOpen} dataAttribute={dataAttribute} />
    </ErrorBoundary>
  );
};
