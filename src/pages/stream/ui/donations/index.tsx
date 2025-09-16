import { Typography } from 'shared/ui/typography';
import { Table, TableFallback } from 'shared/ui/table';
import { $isEndReached, dataRanedOut, onLoadedFirst } from '../../model/donations';
import { Icon } from 'shared/ui/icon';
import { DonationCol } from '../../types';
import { formatter } from 'shared/lib/formatter';
import { useUnit } from 'effector-react';
import { $donations } from 'entities/stream';
import { getFullUrlTx } from 'shared/lib/full-url-tx';
import { animations } from 'shared/config/animations';
import { $isAnimationsEnabled } from 'features/toggle-animations';
import { Timestamp } from 'shared/ui/timestamp';
import { UserProfileTable } from 'shared/ui/maker';
import { LoadedData } from 'shared/ui/loaded-data';

export const columns: DonationCol[] = [
  {
    key: 'Data',
    title: 'Data',
    className: 'min-w-[150px]',
    render: ({ timestamp }) => <Timestamp timestamp={timestamp} offset={-165} />,
  },
  {
    key: 'Donation from',
    title: 'Donation from',
    className: 'min-w-[300px]',
    render: ({ user, wallet_address }) => (
      <div className="flex items-center gap-2">
        <UserProfileTable
          user_id={user.user_id}
          user_nickname={user.user_nickname}
          user_photo_hash={user.user_photo_hash}
          address={wallet_address}
        />
        <Typography
          className="!gap-2"
          icon={{ position: 'left', name: 'dot', size: 4 }}
          color="secondary"
          weight="regular">
          {formatter.address(wallet_address, { start: 6, end: 4 })}
        </Typography>
      </div>
    ),
  },
  {
    key: 'Amount',
    title: 'Amount',
    className: 'w-[35%]',
    render: ({ amount }) => (
      <Typography
        icon={{ name: 'solana', size: 16, position: 'left' }}
        className="!gap-2"
        size="subheadline2"
        weight="regular">
        {amount}
      </Typography>
    ),
  },
  {
    key: 'Icon',
    render: ({}) => <Icon onClick={() => window.open(getFullUrlTx(''), '_blank')} name="action" size={20} />,
  },
];

export const Donations = () => {
  const [donations, isAnimationEnabled] = useUnit([$donations, $isAnimationsEnabled]);
  return (
    <div className="flex w-full flex-col gap-4">
      <Typography
        className="!gap-[6px]"
        icon={{ name: 'donate', size: 18, position: 'left' }}
        size="headline4"
        color="secondary">
        Donations
      </Typography>
      <Table
        onLoaded={onLoadedFirst}
        columns={columns}
        showAnimation
        uniqueKey={({ signature }) => signature}
        animation={{
          first: animations.table.flashAndShake,
        }}
        isAnimationsEnabled={isAnimationEnabled}
        reachedEndOfList={dataRanedOut}
        onRowClick={({ signature }) => {
          window.open(getFullUrlTx(signature), '_blank');
        }}
        $isDataRanedOut={$isEndReached}
        className={{
          row: 'md:hover:!bg-darkGray-2 cursor-pointer',
          noData: '!h-[232px] !min-h-[232px]',
        }}
        noData={
          <div className="flex h-[232px] flex-col items-center justify-center gap-3">
            <Icon name="donate" size={42} className="text-secondary" />
            <Typography color="secondary" size="headline4">
              No donations yet
            </Typography>
          </div>
        }
        rowsCount={10}
        data={donations}
      />
    </div>
  );
};

export const DonationsFallback = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <Typography
        className="!gap-[6px]"
        icon={{ name: 'donate', size: 18, position: 'left' }}
        size="headline4"
        color="secondary">
        Donations
      </Typography>
      <LoadedData isOnce={true} loadedData={onLoadedFirst} />
      <TableFallback columnsCount={columns.length} rowsCount={10} />
    </div>
  );
};
