import { FC, useCallback, useEffect, useState } from 'react';
import {
  Account,
  selectAccountOptions,
  selectAccount,
} from '@sovryn/onboard-hw-common';

type SelectAccountProps = {};

export const SelectAccount: FC<SelectAccountProps> = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {}, []);

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
      console.error(error);
    } finally {
      setScanning(false);
    }
  }, []);

  const handleSelect = useCallback(
    (account: Account) => () => {
      selectAccount(account);
    },
    [],
  );

  return (
    <div
      style={{ backgroundColor: '#dedede', padding: '14px', margin: '14px' }}
    >
      <h1>Choose Address</h1>
      <button onClick={handleScan}>Scan Accounts</button>
      {scanning && <div>Scanning...</div>}
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
