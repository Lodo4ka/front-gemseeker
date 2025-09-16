import { EventCallable } from 'effector';
import { useUnit } from 'effector-react';
import { useCallback } from 'react';
import { formatter } from 'shared/lib/formatter';
import { Typography } from 'shared/ui/typography';

export type CopyAddressProps = {
  address: string;
  copied: EventCallable<string | null | undefined>;
  start?: number;
  end?: number;
  className?: {
    container?: string;
    icon?: string;
    text?: string;
  };
};

export const CopyAddress = ({ address, copied, start, end, className }: CopyAddressProps) => {
  const copyFn = useUnit(copied);

  const copy = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      copyFn(address);
    },
    [address, copyFn],
  );

  return (
    <div className={className?.container}>
      <Typography
        color="secondary"
        weight="regular"
        size="subheadline2"
        as="button"
        onClick={copy}
        className={className?.text}
        icon={{ position: 'right', name: 'copy', size: 16, className: className?.icon }}>
        {formatter.address(address, { start, end })}
      </Typography>
    </div>
  );
};
