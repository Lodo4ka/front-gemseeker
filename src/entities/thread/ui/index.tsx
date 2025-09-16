import clsx from 'clsx';
import { api } from 'shared/api';
import { Icon } from 'shared/ui/icon';
import { Typography } from 'shared/ui/typography';
import { infer as types } from 'zod';
import { Timestamp } from './timestamp';
import { Skeleton } from 'shared/ui/skeleton';
import { useUnit } from 'effector-react';
import { getFullUrlImg } from 'shared/lib/full-url-img';
import { routes } from 'shared/config/router';
import { Link } from 'atomic-router-react';

type ThreadProps = {
  thread: types<typeof api.contracts.thread.single>;
  className?: {
    wrapper?: string;
  };
};

export const Thread = ({ thread, className }: ThreadProps) => {
  const [like, unlike] = useUnit([api.mutations.thread.like.start, api.mutations.thread.unlike.start]);
  const toggleLike = () => {
    if (thread.liked) unlike({ id: thread.id, token_id: thread.token_id });
    else like({ id: thread.id, token_id: thread.token_id });
  };
  return (
    <div className={clsx('w-full flex-col gap-3 py-3', className?.wrapper)}>
      <div className="flex w-full flex-col gap-2">
        <Link to={routes.profile} params={{id: thread.user_id.toString()}} className="flex items-center gap-2">
          <img
            src={getFullUrlImg(thread?.user?.user_photo_hash, thread?.user?.user_nickname)}
            alt="avatar"
            className="h-[30px] w-[30px] rounded-full"
          />
          <Typography size="subheadline1">{thread?.user?.user_nickname}</Typography>
        </Link>
        <Typography size="subheadline2" className="break-all" weight="regular">
          {thread?.text}
        </Typography>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div onClick={toggleLike} className="flex cursor-pointer items-center gap-1">
            <Icon
              name="like"
              className={clsx('text-secondary [&_.fill-path]:fill-[#FF3B81] [&_.fill-path]:opacity-0', {
                '!text-[#FF3B81] [&_.fill-path]:opacity-100': thread.liked,
              })}
              size={14}
            />
            <Typography size="captain1" color="secondary">
              {thread?.likes}
            </Typography>
          </div>
          <div className="flex cursor-pointer items-center gap-1">
            <Icon name="reply" size={14} />
            <Typography size="captain1" color="secondary">
              Reply
            </Typography>
          </div>
        </div>
        <Timestamp timestamp={thread?.timestamp} />
      </div>
    </div>
  );
};

export const ThreadSkeleton = () => {
  return (
    <div className="border-b-separator w-full border-b-[0.5px] py-3">
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-[30px] w-[30px] rounded-full" isLoading />
          <Skeleton className="h-4 w-[120px] rounded" isLoading />
        </div>
        <Skeleton className="mb-3 h-4 w-1/2 rounded" isLoading />
      </div>

      {/* Actions placeholder */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-15 rounded" isLoading />
          <Skeleton className="h-4 w-15 rounded" isLoading />
        </div>
        <Skeleton className="h-4 w-25 rounded" isLoading />
      </div>
    </div>
  );
};
