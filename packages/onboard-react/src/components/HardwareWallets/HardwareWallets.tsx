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
        <div>
          <button onClick={handleStepBack} className={styles.closeButton}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_2955_2007)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.35588 10.4992L24 10.4992V13.4992L2.35588 13.4992V10.4992Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.1173 0.116455L14.2386 2.23778L4.4772 11.9992L14.2386 21.7606L12.1173 23.8819L0.234558 11.9992L12.1173 0.116455Z"
                  fill="currentColor"
                />
              </g>
            </svg>
          </button>
          <div>
            <HardwareWalletSteps step={step} onStepChanged={setStep} />
          </div>
        </div>
      )}
    </>
  );
};
