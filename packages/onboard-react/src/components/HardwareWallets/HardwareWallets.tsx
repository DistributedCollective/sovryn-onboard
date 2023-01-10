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

type HardwareWalletsProps = {
  dataAttribute?: string;
};
export const HardwareWallets: FC<HardwareWalletsProps> = ({
  dataAttribute,
}) => {
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
    const isBackToDerivationPage = step === HardwareWalletStep.addressList;
    const buttonText = isBackToDerivationPage
      ? 'Back to derivation path'
      : 'Back to wallet menu';

    return (
      <ButtonBack
        label={isMobile ? buttonText : ''}
        className={!isMobile && styles.closeButton}
        onClick={handleStepBack}
        dataAttribute={`${dataAttribute}-back-${
          isBackToDerivationPage ? 'derivation' : 'wallet'
        }`}
      />
    );
  }, [step, isMobile, handleStepBack]);

  return (
    <>
      {!inProgress ? (
        <WalletList
          filter={FilterType.hardware}
          dataAttribute={dataAttribute}
        />
      ) : (
        <>
          {buttonBack}
          <div>
            <HardwareWalletSteps
              step={step}
              onStepChanged={setStep}
              dataAttribute={dataAttribute}
            />
          </div>
        </>
      )}
    </>
  );
};
