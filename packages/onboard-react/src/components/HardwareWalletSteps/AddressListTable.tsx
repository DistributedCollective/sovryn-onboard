import { FC, useCallback } from "react";
import { Icon, IconNames } from "@sovryn/ui";
import { Account, selectAccounts$ } from "@sovryn/onboard-hw-common";
import { useSubscription } from "../../hooks/useSubscription";

type AddressListTableProps = {
  items: Account[];
  onAccountSelected: (account: Account) => void;
};

export const AddressListTable: FC<AddressListTableProps> = ({
  items,
  onAccountSelected,
}) => {
  const handleAccountSelect = useCallback(
    (account: Account) => () => onAccountSelected(account),
    [onAccountSelected]
  );

  return (
    <ol>
      {items.map((account, index) => (
        <li key={account.address}>
          #{index}: {account.address} (
          {/* {utils.formatEther(account.balance.value)} {account.balance.asset}) */}
          <button onClick={handleAccountSelect(account)}>choose</button>
        </li>
      ))}
    </ol>
  );
};
