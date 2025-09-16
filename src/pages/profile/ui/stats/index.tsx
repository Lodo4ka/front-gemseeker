import { useUnit } from 'effector-react';
import { Typography } from 'shared/ui/typography';
import { formatter } from 'shared/lib/formatter';
import { Skeleton } from 'shared/ui/skeleton';
import { $user } from 'entities/user';

export const Stats = () => {
  const user = useUnit($user);

  return (
    <div className="flex w-full flex-wrap items-center gap-8 max-sm:gap-5">
      <div className="flex flex-col items-start gap-1">
        <Typography size="subheadline2" weight="regular" color="secondary">
          Likes received
        </Typography>
        <Typography size="subheadline2" color="primary">
          {user?.likes_received}
        </Typography>
      </div>
      <div className="flex flex-col items-start gap-1">
        <Typography size="subheadline2" weight="regular" color="secondary">
          Followers
        </Typography>
        <Typography size="subheadline2" color="primary">
          {user?.followers}
        </Typography>
      </div>
      <div className="flex flex-col items-start gap-1">
        <Typography size="subheadline2" weight="regular" color="secondary">
          Followees
        </Typography>
        <Typography size="subheadline2" color="primary">
          {user?.followees}
        </Typography>
      </div>
      <div className="flex flex-col items-start gap-1">
        <Typography size="subheadline2" weight="regular" color="secondary">
          Mentions received
        </Typography>
        <Typography size="subheadline2" color="primary">
          {user?.mentions_received}
        </Typography>
      </div>
      <div className="flex flex-col items-start gap-1">
        <Typography size="subheadline2" weight="regular" color="secondary">
          Tokens created
        </Typography>
        <Typography size="subheadline2" color="primary">
          {user?.tokens_created}
        </Typography>
      </div>
      <div className="flex flex-col items-start gap-1">
        <Typography size="subheadline2" weight="regular" color="secondary">
          Volume
        </Typography>
        <Typography size="subheadline2" color="primary">
          {formatter.number.uiDefault(user?.volume)}
        </Typography>
      </div>
    </div>
  );
};

export const StatsSkeleton = () => (
  <div className="flex w-full flex-wrap items-center gap-8">
    {Array.from({ length: 5 }).map((_, idx) => (
      <div key={idx} className="flex flex-col items-start gap-1">
        <Skeleton isLoading className="h-5 w-32 rounded" />
        <Skeleton isLoading className="h-5 w-16 rounded" />
      </div>
    ))}
  </div>
);
