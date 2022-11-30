import { FC, useCallback, useState } from "react";
import { closeAccountSelect, selectAccounts$ } from "@sovryn/onboard-hw-common";
import { useSubscription } from "../../hooks/useSubscription";
import { FilterType, WalletList } from "../WalletList/WalletList";

import {
  HardwareWalletStep,
  HardwareWalletSteps,
} from "../HardwareWalletSteps/HardwareWalletSteps";
import { ButtonBack } from "../ButtonBack/ButtonBack";

export const HardwareWallets: FC = () => {
  const { inProgress } = useSubscription(selectAccounts$);
  const [step, setStep] = useState(HardwareWalletStep.derivationPathForm);

  const handleStepBack = useCallback(() => {
    if (step === HardwareWalletStep.derivationPathForm) {
      closeAccountSelect();
    } else if (step === HardwareWalletStep.addressList) {
      setStep(HardwareWalletStep.derivationPathForm);
    }
  }, [step]);

  return (
    <>
      {!inProgress ? (
        <WalletList filter={FilterType.hardware} />
      ) : (
        <>
          <ButtonBack label="Back to wallet menu" onClick={handleStepBack} />
          <div>
            <HardwareWalletSteps step={step} onStepChanged={setStep} />
          </div>
        </>
      )}
    </>
  );
};
