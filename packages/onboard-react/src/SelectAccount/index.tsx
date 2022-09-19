import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import {
  Account,
  selectAccountOptions,
  selectAccount,
  closeAccountSelect,
  Asset,
} from "@sovryn/onboard-hw-common";
import { utils } from "ethers";

type SelectAccountProps = {};

export const SelectAccount: FC<SelectAccountProps> = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string>();

  const [derivationPathSelect, setDerivationPath] = useState<string>(
    selectAccountOptions.basePaths[0].value
  );
  const [chainId, setChainId] = useState<string>(
    selectAccountOptions.chains[0].id
  );
  const [customPath, setCustomPath] = useState<string>(
    selectAccountOptions.basePaths[0].value
  );
  const [asset, setAsset] = useState<Asset>(selectAccountOptions.assets[0]);

  const derivationPath = useMemo(() => {
    if (derivationPathSelect === "custom") {
      return customPath;
    }
    return derivationPathSelect;
  }, [derivationPathSelect, customPath]);

  const handleClose = useCallback(() => {
    closeAccountSelect();
  }, []);

  const handleScan = useCallback(async () => {
    setScanning(true);
    try {
      const list = await selectAccountOptions.scanAccounts({
        derivationPath,
        chainId,
        asset,
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
  }, [asset, chainId, derivationPath]);

  const handleDerivationPathChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      if (event.target.value !== "custom") {
        // update custom path to the last used path from dropdown
        setCustomPath(event.target.value);
      }
      setDerivationPath(event.target.value);
    },
    []
  );

  const handleAccountSelect = useCallback(
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

      <select onChange={handleDerivationPathChange}>
        {selectAccountOptions.basePaths.map((path) => (
          <option value={path.value} key={path.value}>
            {path.label} ({path.value})
          </option>
        ))}
        <option value="custom">Custom</option>
      </select>

      {derivationPathSelect === "custom" && (
        <input
          value={customPath}
          onChange={(e) => setCustomPath(e.target.value)}
        />
      )}

      <select onChange={(e) => setChainId(e.target.value)}>
        {selectAccountOptions.chains.map((chain) => (
          <option value={chain.id} key={chain.id}>
            {chain.label}
          </option>
        ))}
      </select>

      <select onChange={(e) => setAsset({ label: e.target.value })}>
        {selectAccountOptions.assets.map((asset) => (
          <option value={asset.label} key={asset.label}>
            {asset.label}
          </option>
        ))}
      </select>

      <button onClick={handleScan}>Scan Accounts</button>
      <button onClick={handleClose}>Close</button>
      {scanning && <div>Scanning...</div>}
      {error && <div>Error: {error}</div>}
      <ul>
        {accounts.map((account, index) => (
          <li key={account.address}>
            #{index}: {account.address} (
            {utils.formatEther(account.balance.value)} {account.balance.asset})
            <button onClick={handleAccountSelect(account)}>choose</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
