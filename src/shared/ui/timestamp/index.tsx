import { memo, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { formatter } from 'shared/lib/formatter';
import { Popover } from 'shared/ui/popover';
import { Typography } from 'shared/ui/typography';

export type TimestampProps = {
  timestamp: number;
  offset?: number;
};

export const Timestamp = memo(({ timestamp, offset = -105 }: TimestampProps) => {
  const [timeAgo, setTimeAgo] = useState(() => formatter.date.timeAgo(timestamp));
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { ref, inView } = useInView({ rootMargin: '100px 500px' });

  const getNextUpdateDelay = (currentDiff: number): number => {
    if (currentDiff < 60) return 1000;
    if (currentDiff < 3600) return 30000;
    if (currentDiff < 86400) return 300000;
    return 3600000;
  };

  useEffect(() => {
    if (!inView) return;

    const updateTime = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = now - timestamp;
      const newTimeAgo = formatter.date.timeAgo(timestamp);

      setTimeAgo(newTimeAgo);

      const delay = getNextUpdateDelay(diff);
      timerRef.current = setTimeout(updateTime, delay);
    };

    timerRef.current = setTimeout(updateTime, getNextUpdateDelay(Math.floor(Date.now() / 1000) - timestamp));

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timestamp, inView]);

  return (
    <Popover
      isOpen={isOpen}
      className={{ children: 'min-w-[205px] translate-y-7 p-1', container: '!z-2' }}
      offset={-105}
      placement="right"
      trigger={
        <Typography
          ref={ref}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          size="subheadline2"
          weight="regular"
          className="!min-w-[100px]"
          color="secondary">
          {timeAgo}
        </Typography>
      }>
      <Typography className="!w-fit" size="subheadline2" weight="regular" color="secondary">
        {formatter.date.fromUnix(timestamp)}
      </Typography>
    </Popover>
  );
});
