import { FC, useCallback, useMemo, useState } from 'react';

import { utils } from 'ethers';
import { useTranslation } from 'react-i18next';

import { Account, selectAccountOptions } from '@sovryn/onboard-hw-common';
import {
  Button,
  Pagination,
  TableBase,
  ColumnOptions,
  TransactionId,
  Align,
  ButtonSize,
  Paragraph,
} from '@sovryn/ui';

import { formatDataPrefix } from '../../utils';
import styles from './AddressListTable.module.css';

const DEFAULT_PER_PAGE = 5;

type AddressListTableProps = {
  items: Account[];
  onAccountSelected: (account: Account) => void;
  derivationPath: string;
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
  derivationPath,
  perPage = DEFAULT_PER_PAGE,
  dataAttribute,
}) => {
  const { t } = useTranslation();
  // todo: detect to which chain user is supposed to connect
  const chain = selectAccountOptions.chains[0];
  const asset = selectAccountOptions.assets[0];

  const [addresses, setAddresses] = useState(items);
  const [scanning, setScanning] = useState(false);

  const dataPrefix = formatDataPrefix(dataAttribute);
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

  const onPageChange = useCallback(
    async (page: number) => {
      setScanning(true);

      try {
        const list = await selectAccountOptions.scanAccounts({
          derivationPath,
          chainId: chain.id,
          asset,
          start: page * perPage,
          limit: perPage,
        });

        setPage(page);
        setAddresses(list);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error);
        }
      } finally {
        setScanning(false);
      }
    },
    [asset, chain.id, derivationPath, perPage],
  );

  const paginatedItems: Item[] = useMemo(
    () =>
      addresses.map((item, index) => ({
        index: page * perPage + index,
        address: item.address,
        balance: utils.formatEther(item.balance.value),
        asset: item.balance.asset,
        account: item,
      })),
    [addresses, page, perPage],
  );

  const columns: ColumnOptions<Item>[] = useMemo(
    () => [
      {
        id: 'index',
        align: Align.left,
        title: t('addressTable.index'),
        cellRenderer: (row: Item) =>
          `${String(row.index + 1).padStart(2, '0')}.`,
      },
      {
        id: 'address',
        align: Align.center,
        title: t('addressTable.address'),
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
        title: t('addressTable.balance'),
        cellRenderer: (row: Item) =>
          `${Number(row.balance).toLocaleString(undefined, {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
          })} ${row.asset}`,
      },
    ],
    [chain.blockExplorerUrl, t],
  );

  return (
    <div className={styles.container}>
      <TableBase
        columns={columns}
        rows={paginatedItems}
        rowKey={item => item.account.address}
        dataAttribute={`${dataPrefix}addresslist`}
        onRowClick={handleSelect}
        isClickable
        className={styles.table}
        noData={t('hardwareWalletSteps.noMore')}
      />

      <div className={styles.centering}>
        <Pagination
          onChange={onPageChange}
          page={page}
          itemsPerPage={perPage}
          className={styles.pagination}
          hideFirstPageButton
          hideLastPageButton
          isNextButtonDisabled={false}
        />

        <Button
          size={ButtonSize.large}
          onClick={handleConfirm}
          disabled={!selected}
          text={t('hardwareWalletSteps.confirm')}
          className={styles.button}
          dataAttribute={`${dataPrefix}addresslist-confirm`}
        />

        {scanning && (
          <Paragraph className={styles.loadingText}>
            {t('hardwareWalletSteps.scanning')}
          </Paragraph>
        )}
      </div>
    </div>
  );
};
