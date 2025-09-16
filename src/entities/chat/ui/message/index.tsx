import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { $streamInfo } from 'entities/stream';
import { Skeleton } from 'shared/ui/skeleton';
import { Typography } from 'shared/ui/typography';

export type MessageProps = {
  message: string;
  author: {
    name: string;
    id: number;
  };
  className?: {
    wrapper?: string;
    message?: string;
    author?: string;
  };
};

export const Message = ({ message, author, className }: MessageProps) => {
  const streamInfo = useUnit($streamInfo);
  return (
    <div className={clsx('flex w-full items-start gap-[2px]', className?.wrapper)}>
      <Typography
        className={clsx('flex-shrink-0 whitespace-nowrap', className?.author)}
        color={author.id === streamInfo?.creator.user_id ? 'red' : 'green'}>
        {author.name}{' '}
        <Typography as="span" color="primary">
          :{' '}
        </Typography>
      </Typography>
      <Typography className={clsx('min-w-0 flex-1 break-all', className?.message)}>{message}</Typography>
    </div>
  );
};

export const MessageSkeleton = ({ className }: { className?: { wrapper?: string } }) => {
  return (
    <div className={clsx('flex w-full items-start gap-[2px]', className?.wrapper)}>
      <Skeleton className="h-4 w-25 rounded-sm" isLoading={true} />
      <Skeleton className="h-4 w-1 rounded-sm" isLoading={true} />
      <Skeleton className="h-4 w-full rounded-sm" isLoading={true} />
    </div>
  );
};
