import { FC, useCallback, useState } from "react";
import {
  Account,
  selectAccountOptions,
  selectAccount,
  closeAccountSelect,
} from "@sovryn/onboard-hw-common";

type SelectAccountProps = {};

export const SelectAccount: FC<SelectAccountProps> = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string>();

  const handleClose = useCallback(() => {
    closeAccountSelect();
  }, []);

  const handleScan = useCallback(async () => {
    setScanning(true);
    try {
      const list = await selectAccountOptions.scanAccounts({
        // derivationPath: selectAccountOptions.basePaths[0].value,
        derivationPath: `m/44'/60'/0/0'`,
        chainId: selectAccountOptions.chains[0].id,
        asset: selectAccountOptions.assets[0],
      });
      setAccounts(list);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        setError(error.message);
      }
    } finally {
      setScanning(false);
    }
  }, []);

  const handleSelect = useCallback(
    (account: Account) => () => {
      selectAccount(account);
    },
    []
  );

  return (
    <div
      style={{ backgroundColor: "#dedede", padding: "14px", margin: "14px" }}
    >
      <h1>Choose Address</h1>
      <button onClick={handleScan}>Scan Accounts</button>
      <button onClick={handleClose}>Close</button>
      {scanning && <div>Scanning...</div>}
      {error && <div>Error: {error}</div>}
      <ul>
        {accounts.map((account, index) => (
          <li key={account.address}>
            #{index}: {account.address} ({account.balance.value.toString()})
            <button onClick={handleSelect(account)}>choose</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
