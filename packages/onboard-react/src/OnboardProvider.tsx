import { FC, PropsWithChildren } from "react";
import { OnboardAPI } from "@sovryn/onboard-core";
import { connectWallet$ } from "@sovryn/onboard-core/dist/streams";
import { Connect } from "./Connect";
import { useSubscription } from "./hooks/useSubscription";

export type OnboardProviderProps = {
  onboard: OnboardAPI;
};

export const OnboardProvider: FC<PropsWithChildren<OnboardProviderProps>> = ({
  children,
  onboard,
}) => {
  const { module, inProgress } = useSubscription(connectWallet$);
  return (
    <>
      {children}

      {inProgress && <Connect module={module} />}
    </>
  );
};
