/// <reference path="./custom.d.ts" />
import { FC } from 'react';

import { connectWallet$ } from '@sovryn/onboard-core/dist/streams';

import ErrorBoundary from './components/ErrorBoundary';
import WalletDialog from './components/WalletDialog/WalletDialog';
import { useSubscription } from './hooks/useSubscription';

type OnboardProviderProps = {
  dataAttribute?: string;
};

export const OnboardProvider: FC<OnboardProviderProps> = ({
  dataAttribute,
}) => {
  const { inProgress } = useSubscription(connectWallet$);

  return (
    <ErrorBoundary>
      <WalletDialog isOpen={inProgress} dataAttribute={dataAttribute} />
    </ErrorBoundary>
  );
};
