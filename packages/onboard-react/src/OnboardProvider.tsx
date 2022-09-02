import { FC, PropsWithChildren } from "react";
import { OnboardAPI } from "@sovryn/onboard-core";
import { selectAccounts$ } from "@sovryn/onboard-hw-common";
import { connectWallet$ } from "@sovryn/onboard-core/dist/streams";
import { Connect } from "./Connect";
import { useSubscription } from "./hooks/useSubscription";
import { SelectAccount } from "./SelectAccount";

export type OnboardProviderProps = {
  onboard: OnboardAPI;
};

export const OnboardProvider: FC<PropsWithChildren<OnboardProviderProps>> = ({
  children,
}) => {
  const { inProgress, module } = useSubscription(connectWallet$);
  const { inProgress: hwInProgress } = useSubscription(selectAccounts$);

  return (
    <>
      {children}

      {inProgress && !hwInProgress && <Connect module={module} />}
      {hwInProgress && <SelectAccount />}
    </>
  );
};
