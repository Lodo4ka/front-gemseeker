import { Typography } from 'shared/ui/typography';
import { Column, Table, TableFallback } from 'shared/ui/table';
import { LoadedData } from 'shared/ui/loaded-data';
import {
  $isEndReached,
  $refRewardHistory,
  $refRewardHistoryStatus,
  dataRanedOut,
  refRewardHistoryLoadded,
} from '../model';
import { useUnit } from 'effector-react';
import { timeAgo } from 'shared/lib/formatter/date/time-ago';
import { Link } from 'atomic-router-react';
import { RefRewardHistoryResponse } from 'shared/api/queries/user/ref-reward-history';
import { formatter } from 'shared/lib/formatter';
import { getFullUrlTx } from 'shared/lib/full-url-tx';
import { Icon } from 'shared/ui/icon';

export const columns: Column<RefRewardHistoryResponse[0]>[] = [
  {
    key: 'Data',
    title: 'Data',
    className: 'w-[20%] min-w-[100px]',
    render: ({ timestamp }) => (
      <Typography size="subheadline2" weight="regular" color="secondary">
        {timeAgo(timestamp).replace('ago', '')}
      </Typography>
    ),
  },
  {
    key: 'Reward',
    title: 'Reward',
    className: 'w-[60%] min-w-[150px]',
    render: ({ amount }) => (
      <Typography size="subheadline2" weight="regular">
        +{formatter.number.uiDefault(amount)}
      </Typography>
    ),
  },
  {
    key: 'TX ID',
    title: 'TX ID',
    render: ({ tx_id }) => (
      <Typography
        as={Link}
        to={getFullUrlTx(tx_id)}
        size="subheadline2"
        weight="regular"
        className="!gap-2"
        icon={{ position: 'right', size: 16, name: 'link' }}>
        {getFullUrlTx(tx_id)}
      </Typography>
    ),
  },
];

export const RefRewardsHistory = () => {
  const [history, historyStatus] = useUnit([$refRewardHistory, $refRewardHistoryStatus]);

  const isLoading = (historyStatus && history === null) || !history;

  if (isLoading)
    return (
      <>
        <LoadedData loadedData={refRewardHistoryLoadded} />

        <TableFallback rowsCount={3} columnsCount={5} />
      </>  
    );

  return (
    <Table
      columns={columns}
      data={history}
      rowsCount={3}
      className={{ wrapper: 'bg-darkGray-3 max-md:bg-darkGray-1 !max-h-[200px] !min-h-[200px] overflow-y-auto' }}
      reachedEndOfList={dataRanedOut}
      $isDataRanedOut={$isEndReached}
      noData={
        <div className="mx-auto my-0 flex h-full w-full flex-col items-center justify-center gap-4">
          <Icon name="transaction" className="text-secondary" size={55} />
          <Typography size="subheadline2" className="text-center" weight="regular" color="secondary">
            There are currently <br /> no referral transactions yet.
          </Typography>
        </div>
      }
    />
  );
};
