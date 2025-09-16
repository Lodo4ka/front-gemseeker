import { useUnit } from 'effector-react';
import { $walletsBalances } from '../../model';
import { $rate } from 'features/exchange-rate';
import { formatter } from 'shared/lib/formatter';
import { Typography } from 'shared/ui/typography';

export type BalanceProps = {
  public_key: string;
};
export const Balance = ({ public_key }: BalanceProps) => {
  const walletsBalances = useUnit($walletsBalances);
  const rate = useUnit($rate);

  return (
    <div className="flex items-end gap-1">
      <Typography
        icon={{ position: 'left', name: 'solana', size: 14 }}
        className="items-center !gap-2"
        size="subheadline2">
        {formatter.number.uiDefault(walletsBalances.get(public_key))}
      </Typography>
      <Typography color="secondary" size="captain1" weight="regular">
        / {formatter.number.uiDefault((walletsBalances.get(public_key) || 0) * rate)}$
      </Typography>
    </div>
  );
};
