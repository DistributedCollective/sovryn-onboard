import { FC, useCallback, useState } from "react";
import { Icon, IconNames } from "@sovryn/ui";
import { closeAccountSelect, selectAccounts$ } from "@sovryn/onboard-hw-common";
import { useSubscription } from "../../hooks/useSubscription";
import { FilterType, WalletList } from "../WalletList/WalletList";

import styles from "./HardwareWallets.module.css";
import {
  HardwareWalletStep,
  HardwareWalletSteps,
} from "../HardwareWalletSteps/HardwareWalletSteps";

export const HardwareWallets: FC = () => {
  const { inProgress } = useSubscription(selectAccounts$);
  const [step, setStep] = useState<HardwareWalletStep>(
    HardwareWalletStep.derivationPathForm
  );

  const handleGoBack = useCallback(() => {
    if (step === HardwareWalletStep.derivationPathForm) {
      closeAccountSelect();
    } else if (step === HardwareWalletStep.addressList) {
      setStep(HardwareWalletStep.derivationPathForm);
    }
  }, [step]);

  console.log({ step });

  return (
    <>
      {!inProgress ? (
        <WalletList filter={FilterType.hardware} />
      ) : (
        <div className={styles.container}>
          <button onClick={handleGoBack} className={styles.closeButton}>
            <Icon icon={IconNames.ARROW_BACK} />
          </button>
          <div className={styles.content}>
            <HardwareWalletSteps step={step} onStepChanged={setStep} />
          </div>
        </div>
      )}
    </>
  );
};
