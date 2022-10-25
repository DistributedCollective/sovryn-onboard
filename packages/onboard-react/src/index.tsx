/// <reference path="./custom.d.ts" />

import { FC } from "react";
import { connectWallet$ } from "@sovryn/onboard-core/dist/streams";

import { useSubscription } from "./hooks/useSubscription";
import ErrorBoundary from "./components/ErrorBoundary";
import WalletDialog from "./components/WalletDialog/WalletDialog";

export const OnboardProvider: FC = () => {
  const { inProgress } = useSubscription(connectWallet$);

  return (
    <ErrorBoundary>
      <WalletDialog isOpen={inProgress} />
    </ErrorBoundary>
  );
};
