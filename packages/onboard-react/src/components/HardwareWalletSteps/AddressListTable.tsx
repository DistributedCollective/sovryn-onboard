import { FC, useCallback, useMemo, useState } from 'react';

import { utils } from 'ethers';

import { Account, selectAccountOptions } from '@sovryn/onboard-hw-common';
import {
  Button,
  Pagination,
  TableBase,
  ColumnOptions,
  TransactionId,
  Align,
  ButtonSize,
} from '@sovryn/ui';

import styles from './AddressListTable.module.css';

const DEFAULT_PER_PAGE = 5;

type AddressListTableProps = {
  items: Account[];
  onAccountSelected: (account: Account) => void;
  perPage?: number;
  dataAttribute?: string;
};

type Item = {
  index: number;
  address: string;
  balance: string;
  asset: string;
  account: Account;
};

export const AddressListTable: FC<AddressListTableProps> = ({
  items,
  onAccountSelected,
  perPage = DEFAULT_PER_PAGE,
  dataAttribute,
}) => {
  // todo: detect to which chain user is supposed to connect
  const chain = selectAccountOptions.chains[0];

  const [selected, setSelected] = useState<Account>();
  const [page, setPage] = useState(0);

  const handleSelect = useCallback(
    (item: Item) => setSelected(item.account),
    [setSelected],
  );

  const handleConfirm = useCallback(
    () => onAccountSelected(selected!),
    [selected, onAccountSelected],
  );

  const paginatedItems: Item[] = useMemo(
    () =>
      items.slice(page * perPage, (page + 1) * perPage).map((item, index) => ({
        index: page * perPage + index,
        address: item.address,
        balance: utils.formatEther(item.balance.value),
        asset: item.balance.asset,
        account: item,
      })),
    [items, page, perPage],
  );

  const columns: ColumnOptions<Item>[] = useMemo(
    () => [
      {
        id: 'index',
        align: Align.left,
        title: 'Index',
        cellRenderer: (row: Item) =>
          `${String(row.index + 1).padStart(2, '0')}.`,
      },
      {
        id: 'address',
        align: Align.center,
        title: 'Address',
        cellRenderer: (row: Item) => (
          <TransactionId
            value={row.address}
            href={`${chain.blockExplorerUrl}/address/${row.address}`}
          />
        ),
      },
      {
        id: 'balance',
        align: Align.right,
        title: 'Balance',
        cellRenderer: (row: Item) =>
          `${Number(row.balance).toLocaleString(undefined, {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
          })} ${row.asset}`,
      },
    ],
    [chain.blockExplorerUrl],
  );

  return (
    <div className={styles.container}>
      <TableBase
        columns={columns}
        rows={paginatedItems}
        rowKey={item => item.account.address}
        dataAttribute="addressTable"
        onRowClick={handleSelect}
        isClickable
        className={styles.table}
        noData="No more accounts found."
      />

      <div className={styles.centering}>
        <Pagination
          onChange={setPage}
          page={page}
          itemsPerPage={perPage}
          className={styles.pagination}
          totalItems={items.length}
          hideFirstPageButton
          hideLastPageButton
        />

        <Button
          size={ButtonSize.large}
          onClick={handleConfirm}
          disabled={!selected}
          text="Confirm"
          className={styles.button}
          dataAttribute={`${dataAttribute}-addresslist-confirm`}
        />
      </div>
    </div>
  );
};
