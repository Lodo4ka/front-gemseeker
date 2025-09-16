import { useUnit } from 'effector-react';
import { api } from 'shared/api';
import { formatter } from 'shared/lib/formatter';
import { Icon } from 'shared/ui/icon';
import { Column, Table } from 'shared/ui/table';
import { Typography } from 'shared/ui/typography';
import { infer as types } from 'zod';
import { tableWithdraw } from '../../../model/history';
import { LoadedData } from 'shared/ui/loaded-data';
import { getFullUrlTx } from 'shared/lib/full-url-tx';

const withdrawColumns: Column<types<typeof api.contracts.wallets.tx>>[] = [
  {
    key: 'title',
    title: 'Withdraw Amount',
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
      <Icon onClick={() => window.open(getFullUrlTx(signature), '_blank')} name="action" size={20} />
    ),
  },
];
export const WithdrawHistory = () => {
  const history = useUnit(tableWithdraw.$history);
  return (
    <div className="flex w-full flex-col gap-4">
      <LoadedData className="relative" isOnce={true} loadedData={tableWithdraw.loadedList} />
      <Typography
        className="!gap-2"
        icon={{ name: 'history', position: 'left', size: 20 }}
        size="headline4"
        color="secondary">
        Withdraw history
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
        reachedEndOfList={tableWithdraw.pagination.dataRanedOut}
        $isDataRanedOut={tableWithdraw.pagination.$isEndReached}
        className={{
          container: 'overflow-y-auto',
          row: 'hover:!bg-darkGray-1',
        }}
        columns={withdrawColumns}
        rowsCount={5}
        data={history}
      />
    </div>
  );
};
