import { useUnit } from 'effector-react';
import { $rate } from 'features/exchange-rate';
import { formatter } from 'shared/lib/formatter';
import { Typography } from 'shared/ui/typography';

export type AmountProps = {
  type: string;
  sol_amount: number;
};

export const Amount = ({ type, sol_amount }: AmountProps) => {
  const rate = useUnit($rate);
  return (
    <Typography size="subheadline2" color={type === 'BUY' ? 'green' : 'red'} weight="regular">
      ${formatter.number.formatSmallNumber(sol_amount * rate)}
    </Typography>
  );
};
