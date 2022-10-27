import { FC, useCallback, useMemo, useState } from "react";
import { Button, AddressTablePagination } from "@sovryn/ui";
import { Account } from "@sovryn/onboard-hw-common";
import { utils } from "ethers";
import styles from "./AddressListTable.module.css";

const PER_PAGE = 5;

type AddressListTableProps = {
  items: Account[];
  onAccountSelected: (account: Account) => void;
};

export const AddressListTable: FC<AddressListTableProps> = ({
  items,
  onAccountSelected,
}) => {
  const [selected, setSelected] = useState<Account>();
  const [offset, setOffset] = useState(0);

  const handleSelect = useCallback(
    (account: Account) => () => setSelected(account),
    [setSelected]
  );

  const handleConfirm = useCallback(
    () => onAccountSelected(selected!),
    [selected, onAccountSelected]
  );

  const paginatedItems = useMemo(
    () => items.slice(offset, offset + PER_PAGE),
    [items, offset]
  );

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>Address</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((account, index) => (
            <tr key={account.address} onClick={handleSelect(account)}>
              <td>{String(index).padStart(2, "0")}.</td>
              <td>{account.address.substring(0, 12)}</td>
              <td>
                {Number(
                  utils.formatEther(account.balance.value)
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 4,
                  maximumFractionDigits: 4,
                })}{" "}
                {account.balance.asset}
              </td>
            </tr>
          ))}
          {paginatedItems.length === 0 && (
            <tr>
              <td colSpan={3}>There is no more active accounts.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={styles.centering}>
        <AddressTablePagination
          onPageChange={setOffset}
          itemsPerPage={PER_PAGE}
          className={styles.pagination}
        />

        <Button
          onClick={handleConfirm}
          disabled={!selected}
          text="Confirm"
          className={styles.button}
        />
      </div>
    </>
  );
};
