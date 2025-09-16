import { useUnit } from 'effector-react';
import { $totalAmount } from 'entities/wallet';
import { $rate } from 'features/exchange-rate';
import { Typography } from 'shared/ui/typography';
import { formatter } from 'shared/lib/formatter';

export const TotalAmount = () => {
  const [totalAmount, rate] = useUnit([$totalAmount, $rate]);
  return (
    <div className="flex items-center gap-3 max-sm:flex-col max-sm:items-start max-sm:gap-1">
      <Typography size="subheadline2" color="secondary" weight="regular">
        Total
      </Typography>
      <div className="flex items-end gap-[2px]">
        <Typography
          icon={{ position: 'left', name: 'solana', size: 18 }}
          className="items-center !gap-1"
          size="headline3">
          {totalAmount}
        </Typography>
        <Typography color="secondary" size="captain1" weight="regular">
          / {formatter.number.round(totalAmount * rate)}$
        </Typography>
      </div>
    </div>
  );
};
