import { FC, useCallback, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { closeAccountSelect, selectAccounts$ } from '@sovryn/onboard-hw-common';

import { useIsMobile } from '../../hooks/useIsMobile';
import { useSubscription } from '../../hooks/useSubscription';
import { formatDataPrefix } from '../../utils';
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
  const { t } = useTranslation();
  const dataPrefix = formatDataPrefix(dataAttribute);
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
      ? t('hardware.backDerivation')
      : t('common.backToMenu');

    return (
      <ButtonBack
        label={isMobile ? buttonText : ''}
        className={!isMobile && styles.closeButton}
        onClick={handleStepBack}
        dataAttribute={`${dataPrefix}back-${
          isBackToDerivationPage ? 'derivation' : 'wallet'
        }`}
      />
    );
  }, [step, t, isMobile, handleStepBack, dataPrefix]);

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
