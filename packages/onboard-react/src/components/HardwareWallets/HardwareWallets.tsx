import { FC, useCallback, useMemo, useState } from 'react';

import { closeAccountSelect, selectAccounts$ } from '@sovryn/onboard-hw-common';

import { useIsMobile } from '../../hooks/useIsMobile';
import { useSubscription } from '../../hooks/useSubscription';
import { ButtonBack } from '../ButtonBack/ButtonBack';
import {
  HardwareWalletStep,
  HardwareWalletSteps,
} from '../HardwareWalletSteps/HardwareWalletSteps';
import { FilterType, WalletList } from '../WalletList/WalletList';
import styles from './HardwareWallets.module.css';

export const HardwareWallets: FC = () => {
  const { inProgress } = useSubscription(selectAccounts$);
  const [step, setStep] = useState(HardwareWalletStep.derivationPathForm);
  const { isMobile } = useIsMobile();

  const handleStepBack = useCallback(() => {
    if (step === HardwareWalletStep.derivationPathForm) {
      closeAccountSelect();
    } else if (step === HardwareWalletStep.addressList) {
      setStep(HardwareWalletStep.derivationPathForm);
    }
  }, [step]);

  const buttonBack = useMemo(() => {
    const buttonText =
      step === HardwareWalletStep.addressList
        ? 'Back to derivation path'
        : 'Back to wallet menu';

    return (
      <ButtonBack
        label={isMobile ? buttonText : ''}
        className={!isMobile && styles.closeButton}
        onClick={handleStepBack}
      />
    );
  }, [step, isMobile, handleStepBack]);

  return (
    <>
      {!inProgress ? (
        <WalletList filter={FilterType.hardware} />
      ) : (
        <>
          {buttonBack}
          <div>
            <HardwareWalletSteps step={step} onStepChanged={setStep} />
          </div>
        </>
      )}
    </>
  );
};
