import { FC, ReactNode, useCallback, useMemo, useState } from "react";
import {
  Button,
  AddressTablePagination,
  TableBase,
  ColumnOptions,
  TransactionId,
  Align,
} from "@sovryn/ui";
import { Account } from "@sovryn/onboard-hw-common";
import { utils } from "ethers";
import styles from "./AddressListTable.module.css";

const PER_PAGE = 5;

type AddressListTableProps = {
  items: Account[];
  onAccountSelected: (account: Account) => void;
};

type Item = {
  index: string;
  address: ReactNode;
  balance: string;
  asset: string;
  account: Account;
};

export const AddressListTable: FC<AddressListTableProps> = ({
  items,
  onAccountSelected,
}) => {
  const [selected, setSelected] = useState<Account>();
  const [offset, setOffset] = useState(0);

  const handleSelect = useCallback(
    (item: Item) => setSelected(item.account),
    [setSelected]
  );

  const handleConfirm = useCallback(
    () => onAccountSelected(selected!),
    [selected, onAccountSelected]
  );

  const paginatedItems: Item[] = useMemo(
    () =>
      items.slice(offset, offset + PER_PAGE).map((item, index) => ({
        index: String(offset + index).padStart(2, "0"),
        address: (
          <TransactionId
            value={item.address}
            href={`https://explorer.rsk.co/address/${item.address}`}
          />
        ),
        balance: utils.formatEther(item.balance.value),
        asset: item.balance.asset,
        account: item,
      })),
    [items, offset]
  );

  const columns: ColumnOptions<Item>[] = useMemo(
    () => [
      {
        id: "index",
        align: Align.left,
        title: "Index",
        cellRenderer: (row: Item) => `${row.index}.`,
      },
      {
        id: "address",
        align: Align.center,
        title: "Address",
      },
      {
        id: "balance",
        align: Align.right,
        title: "Balance",
        cellRenderer: (row: Item) =>
          `${Number(row.balance).toLocaleString(undefined, {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
          })} ${row.asset}`,
      },
    ],
    []
  );

  return (
    <div className={styles.container}>
      <TableBase
        columns={columns}
        rows={paginatedItems}
        rowKey={(item) => item.account.address}
        dataAttribute="addressTable"
        onRowClick={handleSelect}
        isClickable
      />

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
    </div>
  );
};
