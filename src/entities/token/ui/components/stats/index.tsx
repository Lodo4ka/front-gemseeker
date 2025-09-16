import clsx from 'clsx';
import { formatter } from 'shared/lib/formatter';
import { TimeAgo } from 'shared/ui/time-ago';
import { Skeleton } from 'shared/ui/skeleton';
import { Typography } from 'shared/ui/typography';
import { RunningLine } from 'shared/ui/running-line';

interface StatsProps {
  creation_date?: number;
  count_holders?: number;
  count_tx?: number;
  username?: string;
  className?: string;
}

export const Stats = ({ creation_date, count_holders, count_tx, username, className }: StatsProps) => (
  <div className={clsx('flex items-center gap-2', className)}>
    <Typography
      className="text-nowrap"
      color="secondary"
      weight="regular"
      size="captain1"
      icon={{ name: 'time', position: 'left', size: 16 }}>
      {/* {timeAgo(creation_date ?? 0).replace('ago', '')} */}
      <TimeAgo unixTimestamp={creation_date ?? 0} />
    </Typography>
    <Typography
      className="text-nowrap"
      color="secondary"
      weight="regular"
      size="captain1"
      icon={{ name: 'users', position: 'left', size: 16 }}>
      {count_holders}
    </Typography>
    <Typography
      className="text-nowrap"
      color="secondary"
      weight="regular"
      size="captain1"
      icon={{ name: 'wallet', position: 'left', size: 16 }}>
      {formatter.number.uiDefault(count_tx ?? 0)}
    </Typography>

    <Typography
      className="max-w-[140px] truncate"
      color="secondary"
      weight="regular"
      size="captain1"
      icon={{ name: 'cook', position: 'left', size: 16 }}>
      {username}
    </Typography>

    {/* <RunningLine
      texts={Array(3).fill(username ?? '')}
      className='max-w-[140px] truncate' 
      color="secondary" 
      weight="regular" 
      size="captain1" 
      icon={{ name: 'cook', position: 'left', size: 16 }}
    >
      {username}
    </RunningLine> */}
  </div>
);

export const StatsFallback = () => (
  <div className="flex items-center gap-2">
    {[1, 2, 3, 4].map((_, index) => (
      <Skeleton key={index} isLoading className="h-4 w-8" />
    ))}
  </div>
);
