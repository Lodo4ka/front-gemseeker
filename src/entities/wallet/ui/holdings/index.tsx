import { useUnit } from 'effector-react';
import { $rate } from 'features/exchange-rate';
import { Typography } from 'shared/ui/typography';

export type HoldingsProps = {
  holdings: number;
};
export const Holdings = ({ holdings }: HoldingsProps) => {
  const rate = useUnit($rate);
  return (
    <div className="flex items-end gap-1">
      <Typography
        icon={{ position: 'left', name: 'solana', size: 14 }}
        className="items-center !gap-2"
        size="subheadline2">
        {holdings}
      </Typography>
      <Typography color="secondary" size="captain1" weight="regular">
        / {holdings * rate}$
      </Typography>
    </div>
  );
};
