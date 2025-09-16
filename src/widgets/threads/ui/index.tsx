import { useUnit } from 'effector-react';
import { ListWithPagination } from 'shared/ui/list-with-pagination';
import { Icon } from 'shared/ui/icon';
import { Typography } from 'shared/ui/typography';
import clsx from 'clsx';
import { Thread, ThreadSkeleton } from 'entities/thread';
import { $threads, $tokenThreadsIds } from 'entities/thread';
import { $isEndReached, dataRanedOut, onLoadedFirst } from '../model';
import { $tokenId } from 'entities/token';
import { ThreadCreate } from 'features/thread';

export const Threads = () => {
  const [threads, tokenId, threadsIds] = useUnit([$threads, $tokenId, $tokenThreadsIds]);

  return (
    <div className="flex w-full flex-col gap-3">
      <ListWithPagination
        list={threadsIds}
        isOnce={true}
        noData={
          <div className="my-10 flex h-full w-full flex-col items-center justify-center gap-2">
            <Icon className="text-secondary" name="chat" size={55} />
            <Typography size="subheadline2" className="text-center" weight="regular" color="secondary">
              There are currently <br /> no messages yet.
            </Typography>
          </div>
        }
        className={{
          wrapper: 'bg-darkGray-1 z-1 rounded-xl px-4 [mask-image:linear-gradient(to_bottom,black,black)]',
        }}
        $isDataRanedOut={$isEndReached}
        reachedEndOfList={dataRanedOut}
        onLoaded={onLoadedFirst}
        skeleton={{
          Element: <ThreadSkeleton />,
          count: 5,
        }}
        layout="window"
        renderItem={(threadId, index) => {
          if (!tokenId) return null;
          const thread = threads[tokenId]?.[threadId];
          if (!thread) return null;
          return (
            <Thread
              key={thread.id}
              thread={thread}
              className={{
                wrapper: clsx({
                  'border-b-separator border-b-[0.5px]': index !== (threadsIds?.length ?? 0) - 1,
                }),
              }}
            />
          );
        }}
      />
      <ThreadCreate />
    </div>
  );
};
