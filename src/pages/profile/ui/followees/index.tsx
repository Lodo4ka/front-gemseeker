import { Typography } from 'shared/ui/typography';
import { Table } from 'shared/ui/table';
import { $isEndReached, dataRanedOut, onLoadedFirst } from '../../model/followees';
import { useUnit } from 'effector-react';
import { routes } from 'shared/config/router';
import { Icon } from 'shared/ui/icon';
import { $followees, UserMiniCol } from 'entities/user';
import { getFullUrlImg } from 'shared/lib/full-url-img';
import { ImageHover } from 'shared/ui/image';

export const columns: UserMiniCol[] = [
  {
    key: 'Name',
    title: 'Name',
    className: 'w-[85%]',
    render: ({ user_photo_hash, user_nickname }) => (
      <div className="flex items-center gap-2">
        <ImageHover
          preview={getFullUrlImg(user_photo_hash, user_nickname)}
          alt="user"
          className="h-8 w-8 rounded-full"
        />

        <Typography size="subheadline2">{user_nickname}</Typography>
      </div>
    ),
  },
  {
    key: 'Followers',
    title: 'Followers',
    className: '',
    render: ({ user_followers }) => (
      <Typography size="subheadline2" weight="regular">
        {user_followers}
      </Typography>
    ),
  },
];

export const Followees = () => {
  const followees = useUnit($followees);
  const navigate = useUnit(routes.profile.open);

  return (
    <Table
      onLoaded={onLoadedFirst}
      columns={columns}
      onRowClick={({ user_id }) => navigate({ id: String(user_id) })}
      reachedEndOfList={dataRanedOut}
      $isDataRanedOut={$isEndReached}
      className={{
        row: 'md:hover:!bg-darkGray-2 cursor-pointer',
        wrapper: 'bg-darkGray-3 max-2lg:bg-darkGray-1',
        container: 'h-[430px] overflow-y-auto',
      }}
      rowsCount={10}
      data={followees}
      noData={
        <div className="flex h-[400px] w-full flex-col items-center justify-center">
          <Icon name="no_transactions" size={55} />
          <Typography size="subheadline2" className="text-center" weight="regular" color="secondary">
            There are currently <br /> no followees yet.
          </Typography>
        </div>
      }
    />
  );
};
