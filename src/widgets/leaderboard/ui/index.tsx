import { Typography } from 'shared/ui/typography';
import { Column, Table, TableFallback } from 'shared/ui/table';
import { Button } from 'shared/ui/button';
import { useUnit } from 'effector-react';
import { leaderBoardQuery, changedSortingFilter, $sortingFilter, sortingFilterParams, $isEndReached, dataRanedOut, loaddedLeaderBoard, $leaderboard } from '../model';
import { formatter } from 'shared/lib/formatter';
import clsx from 'clsx';
import { ImageHover } from 'shared/ui/image';
import { getFullUrlImg } from 'shared/lib/full-url-img';
import { LeaderboardTop100Response } from 'shared/api/queries/leaderboard/top100';
import { LoadedData } from 'shared/ui/loaded-data';
import { Link } from 'atomic-router-react';
import { routes } from 'shared/config/router';

interface TextFilterProps { 
  text: string
  variant: sortingFilterParams
}

const TextFilter = ({ text, variant }: TextFilterProps) => {
  const [handleSorting, sortingFilter] = useUnit([changedSortingFilter, $sortingFilter]);
  
  return (
    <div className="flex items-center gap-2">
      <Typography size="subheadline2" color="secondary">
        {text}
      </Typography>
      <Button
        onClick={() => handleSorting(sortingFilter === variant ? null : variant)}
        className={{ 
          button: clsx('!rounded-sm !p-[2px]', {
            'bg-darkGray-2': sortingFilter === variant
          })
        }}
        theme="secondary"
        icon={{ position: 'center', name: 'sort', size: 20 }}
      />
    </div>
  );
};

export const columns: Column<LeaderboardTop100Response[0]>[] = [
  {
    key: 'User',
    title: 'User',
    className: 'w-[55%] min-w-[200px]',
    render: ({place, user}) => (
      <Link to={routes.profile} params={{id: user.user_id?.toString()}} className="flex items-center">
        <Typography className='w-[60px]' size="subheadline2">{place}</Typography>

        <div className="flex items-center gap-2">
          <ImageHover
            preview={getFullUrlImg(user.user_photo_hash, user.user_nickname)}
            className='h-[30px] w-[30px] rounded-full'
          />

          <Typography className='max-w-[130px] truncate' size="subheadline2">{user.user_nickname}</Typography>
        </div>
      </Link>
    ),
  },
  {
    key: 'Volume',
    title: <TextFilter variant="volume" text="Volume" />,
    className: '',
    render: ({volume}) => (
      <Typography size="subheadline2" weight="regular">
        ${formatter.number.uiDefault(volume)}
      </Typography>
    ),
  },
  {
    key: 'PnL',
    title: <TextFilter variant='pnl' text="PnL" />,
    className: '',
    render: ({pnl}) => (
      <Typography size="subheadline2" color={pnl > 0 ? "green" : "red"} weight="regular">
        {pnl > 0 ? '+' : '-'}${formatter.number.uiDefault(pnl)}
      </Typography>
    ),
  },
];

export const LeaderboardTable = () => {
  const [leaderboard, isPeding] = useUnit([$leaderboard, leaderBoardQuery.$pending]);
  const isLoading = (isPeding && leaderboard?.length === 0) || leaderboard === null;

  return (
    <div className='relative'>
      <LoadedData
        className='absolute inset-0 w-full h-full'
        loadedData={loaddedLeaderBoard} 
      />

      {isLoading ? 
        <TableFallback
          rowsCount={30}
          columnsCount={3}
        />
        :
        <Table
          columns={columns}
          className={{ wrapper: '!bg-darkGray-1' }}
          rowsCount={3}
          data={leaderboard}
          $isDataRanedOut={$isEndReached}
          reachedEndOfList={dataRanedOut}
        />
      }
    </div>
  );
};
