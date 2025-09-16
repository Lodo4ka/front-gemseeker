import { useUnit } from 'effector-react';
import { ListWithPagination } from 'shared/ui/list-with-pagination';
import { EventCallable, StoreWritable } from 'effector';
import { Icon } from 'shared/ui/icon';
import { Typography } from 'shared/ui/typography';
import { type StreamIdsStore, StreamCard } from 'entities/stream';
import { LivestreamTokenFallback } from 'entities/token';

type PostProps = {
  $streamIds: StreamIdsStore;
  $isEndReached: StoreWritable<boolean>;
  reachedEndOfList: EventCallable<void>;
  onLoaded?: EventCallable<void>;
};

export const StreamList = ({ $streamIds, $isEndReached, reachedEndOfList, onLoaded }: PostProps) => {
  const streamIds = useUnit($streamIds);
  return (
    <ListWithPagination
      list={streamIds}
      isOnce={true}
      noData={
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <Icon name="livestream" className="text-primary" size={55} />
          <Typography size="subheadline2" className="text-center" weight="regular" color="secondary">
            There are currently <br /> no streams yet.
          </Typography>
        </div>
      }
      className={{
        wrapper: 'relative',
        inView: 'bottom-[1500px]',
        list: 'grid grid-cols-1 gap-[10px] !overflow-visible sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4',
      }}
      $isDataRanedOut={$isEndReached}
      reachedEndOfList={reachedEndOfList}
      onLoaded={onLoaded}
      skeleton={{ Element: <LivestreamTokenFallback />, count: 15 }}
      layout="grid"
      renderItem={(streamId) => <StreamCard key={streamId} slug={streamId} />}
    />
  );
};
