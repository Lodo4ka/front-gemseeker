import { useUnit } from 'effector-react';
import { Typography } from 'shared/ui/typography';
import { Column, Table } from 'shared/ui/table';
import { api } from 'shared/api';
import { infer as types } from 'zod';
import { Icon } from 'shared/ui/icon';
import { formatter } from 'shared/lib/formatter';
import { tableDeposit } from '../../../model/history';
import { LoadedData } from 'shared/ui/loaded-data';
import { getFullUrlTx } from 'shared/lib/full-url-tx';

export const depositColumns: Column<types<typeof api.contracts.wallets.tx>>[] = [
  {
    key: 'title',
    title: 'Deposit Amount',
    render: ({ amount }) => (
      <Typography icon={{ name: 'solana', position: 'left', size: 14 }} size="subheadline2">
        {formatter.number.round(amount)}
      </Typography>
    ),
  },
  {
    key: 'Wallet to',
    title: 'Wallet to',
    render: ({ wallet_address }) => (
      <Typography size="subheadline2">{formatter.address(wallet_address, { start: 5, end: 5 })}</Typography>
    ),
  },
  {
    key: 'Date',
    title: 'Date',
    className: 'min-w-[200px]',
    render: ({ timestamp }) => <Typography size="subheadline2">{formatter.date.fromUnix(timestamp)}</Typography>,
  },
  {
    key: 'Status',
    title: 'Status',
    render: () => (
      <Typography size="subheadline2" color="green">
        Success
      </Typography>
    ),
  },
  {
    key: 'Icon',
    render: ({ signature }) => (
      <Icon
        onClick={() => window.open(getFullUrlTx(signature), '_blank')}
        className="cursor-pointer"
        name="action"
        size={20}
      />
    ),
  },
];

export const DepositHistory = () => {
  const history = useUnit(tableDeposit.$history);

  return (
    <div className="flex w-full flex-col gap-4">
      <LoadedData loadedData={tableDeposit.loadedList} />

      <Typography
        className="!gap-2"
        icon={{ name: 'history', position: 'left', size: 20 }}
        size="headline4"
        color="secondary">
        Deposit history
      </Typography>

      <Table
        noData={
          <div className="my-12 flex w-full flex-col items-center">
            <Icon name="no_transactions" size={55} />
            <Typography size="subheadline2" weight="regular" color="secondary">
              There are currently <br /> no transactions yet.
            </Typography>
          </div>
        }
        reachedEndOfList={tableDeposit.pagination.dataRanedOut}
        $isDataRanedOut={tableDeposit.pagination.$isEndReached}
        className={{
          container: 'overflow-y-auto',
          row: 'hover:!bg-darkGray-1',
        }}
        columns={depositColumns}
        rowsCount={5}
        data={history}
      />
    </div>
  );
};
