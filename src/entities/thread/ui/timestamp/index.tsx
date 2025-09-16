import { useState } from 'react';
import { formatter } from 'shared/lib/formatter';
import { Popover } from 'shared/ui/popover';
import { Typography } from 'shared/ui/typography';

export const Timestamp = ({ timestamp }: { timestamp: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover
      isOpen={isOpen}
      className={{ children: 'min-w-[205px] translate-y-7 p-1' }}
      offset={-70}
      placement="left"
      trigger={
        <Typography
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          size="subheadline2"
          weight="regular"
          color="secondary">
          {formatter.date.timeAgo(timestamp)}
        </Typography>
      }>
      <Typography className="!w-fit" size="subheadline2" weight="regular" color="secondary">
        {formatter.date.fromUnix(timestamp)}
      </Typography>
    </Popover>
  );
};
