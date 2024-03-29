import { FC, useCallback, useState } from 'react';

import {
  Account,
  selectAccount,
  selectAccountOptions,
} from '@sovryn/onboard-hw-common';

import { AddressListTable } from './AddressListTable';
import { DerivationPathForm } from './DerivationPathForm';

export enum HardwareWalletStep {
  derivationPathForm,
  addressList,
}

type HardwareWalletStepsProps = {
  step: HardwareWalletStep;
  onStepChanged: (step: HardwareWalletStep) => void;
  dataAttribute?: string;
};

export const HardwareWalletSteps: FC<HardwareWalletStepsProps> = ({
  step,
  onStepChanged,
  dataAttribute,
}) => {
  const chainId = selectAccountOptions.chains[0].id;
  const asset = selectAccountOptions.assets[0];

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string>();

  const [derivationPath, setDerivationPath] = useState(
    selectAccountOptions.basePaths[0].value,
  );

  const handleDerivationPathChange = useCallback(
    async (path: string) => {
      setDerivationPath(path);

      setScanning(true);
      try {
        const list = await selectAccountOptions.scanAccounts({
          derivationPath: path,
          chainId,
          asset,
          start: 0,
          limit: 5,
        });
        setAccounts(list);
        onStepChanged(HardwareWalletStep.addressList);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error);
          setError(error.message);
        }
      } finally {
        setScanning(false);
      }
    },
    [asset, chainId, onStepChanged],
  );

  const handleSelectedAccount = useCallback(
    (account: Account) => selectAccount(account),
    [],
  );

  return (
    <>
      {step === HardwareWalletStep.derivationPathForm && (
        <DerivationPathForm
          value={derivationPath}
          onChange={handleDerivationPathChange}
          basePaths={selectAccountOptions.basePaths}
          error={error}
          loading={scanning}
          dataAttribute={dataAttribute}
        />
      )}

      {step === HardwareWalletStep.addressList && (
        <AddressListTable
          items={accounts}
          onAccountSelected={handleSelectedAccount}
          dataAttribute={dataAttribute}
          derivationPath={derivationPath}
        />
      )}
    </>
  );
};
