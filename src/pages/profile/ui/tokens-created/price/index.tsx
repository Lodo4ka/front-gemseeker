import { useUnit } from 'effector-react';
import { $rate } from 'features/exchange-rate';
import { formatter } from 'shared/lib/formatter';
import { Typography } from 'shared/ui/typography';

export type PriceProps = {
  price: number;
};

export const Price = ({ price }: PriceProps) => {
  const rate = useUnit($rate);
  return (
    <Typography size="subheadline2" weight="regular">
      ${formatter.number.formatSmallNumber(price * rate)}
    </Typography>
  );
};
