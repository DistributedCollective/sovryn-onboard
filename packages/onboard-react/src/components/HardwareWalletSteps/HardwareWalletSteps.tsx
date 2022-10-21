import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import { Icon, IconNames } from "@sovryn/ui";
import {
  Account,
  selectAccount,
  selectAccountOptions,
} from "@sovryn/onboard-hw-common";
import { DerivationPathForm } from "./DerivationPathForm";
import { AddressListTable } from "./AddressListTable";

export enum HardwareWalletStep {
  derivationPathForm,
  addressList,
}

type HardwareWalletStepsProps = {
  step: HardwareWalletStep;
  onStepChanged: (step: HardwareWalletStep) => void;
};

export const HardwareWalletSteps: FC<HardwareWalletStepsProps> = ({
  step,
  onStepChanged,
}) => {
  const [chainId, setChainId] = useState(selectAccountOptions.chains[0].id);
  const [asset, setAsset] = useState(selectAccountOptions.assets[0]);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string>();

  const [dPath, setDPath] = useState<string>(
    selectAccountOptions.basePaths[0].value
  );

  const handleDPathChange = useCallback(
    async (path: string) => {
      setDPath(path);

      setScanning(true);
      try {
        const list = await selectAccountOptions.scanAccounts({
          derivationPath: path,
          chainId,
          asset,
        });
        setAccounts(list);
        onStepChanged(HardwareWalletStep.addressList);
      } catch (error) {
        console.log("failed to scan", error);
        if (error instanceof Error) {
          console.error(error);
          setError(error.message);
        }
      } finally {
        setScanning(false);
      }
    },
    [asset, chainId, onStepChanged]
  );

  const handleSelectedAccount = useCallback(
    (account: Account) => selectAccount(account),
    []
  );

  return (
    <>
      {scanning && "Scanning..."}
      {error && "Error: " + error.toString()}

      {step === HardwareWalletStep.derivationPathForm && (
        <DerivationPathForm
          value={dPath}
          onChange={handleDPathChange}
          basePaths={selectAccountOptions.basePaths}
        />
      )}

      {step === HardwareWalletStep.addressList && (
        <AddressListTable
          items={accounts}
          onAccountSelected={handleSelectedAccount}
        />
      )}
    </>
  );
};
