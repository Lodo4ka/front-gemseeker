import { useUnit } from 'effector-react';
import { $balanceCastodial } from 'entities/wallet';
import { formatter } from 'shared/lib/formatter';
import { Button } from 'shared/ui/button';
import { Input } from 'shared/ui/input';
import { Typography } from 'shared/ui/typography';
import { amount, maxClicked } from '../../../model/input';
import clsx from 'clsx';
import { $balanceToken, $token } from 'entities/token';
import { ImageHover } from 'shared/ui/image';
import { getFullUrlImg } from 'shared/lib/full-url-img';
import { InputAddon } from 'shared/ui/input/index.type';
import { IconName } from 'shared/ui/icon';

export type AmountInputProps = {
  type: 'BUY' | 'SELL';
  className?: string;
  helpers: {
    view: string;
    onClick: () => void;
  }[];
};
export const AmountInput = ({ type, helpers, className }: AmountInputProps) => {
  const [balanceSol, balanceToken] = useUnit([$balanceCastodial, $balanceToken]);
  const [value, changeAmount] = useUnit([amount.$value, amount.fieldUpdated]);
  const token = useUnit($token);
  const max = useUnit(maxClicked);
  const balance = type === 'BUY' ? balanceSol : balanceToken;
  const rightAddon = (
    type === 'BUY'
      ? {
          icon: 'solana' as IconName,
          size: 16,
          className: 'text-secondary',
        }
      : {
          text: (
            <ImageHover
              preview={getFullUrlImg(token?.photo_hash ?? '', token?.name ?? '')}
              alt={token?.symbol}
              width={20}
              height={20}
            />
          ),
          size: 16,
          className: 'text-secondary',
        }
  ) as InputAddon;

  return (
    <div className={clsx('flex w-full flex-col gap-5', className)}>
      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center gap-2">
          <Typography size="subheadline1" color="secondary">
            Bal: {formatter.number.round(balance, 4)} {type === 'BUY' ? 'SOL' : token?.symbol}
          </Typography>
          <Button
            onClick={() => max({ type })}
            className={{ button: 'text-secondary !rounded-sm !px-2 !py-0 text-[14px]' }}
            theme="darkGray">
            Max
          </Button>
        </div>
        <Input
          classNames={{ flex: '2lg:!bg-darkGray-2 !border-separator !border-[0.5px] 2lg:!border-none  !bg-darkGray-1' }}
          theme="secondary"
          placeholder="Amount"
          rightAddon={rightAddon}
          value={value}
          onValue={changeAmount}
        />
      </div>
      <div className="border-separator flex overflow-hidden rounded-lg border-[0.5px]">
        {helpers.map((helper) => (
          <Button
            key={helper.view}
            theme="darkGray"
            onClick={helper.onClick}
            className={{
              button: clsx(
                'border-r-separator text-secondary w-full rounded-none border-r-[0.5px] bg-transparent !px-3 !py-2 text-[14px]',
                {
                  'border-r-0': helper.view === helpers[helpers.length - 1]?.view,
                },
              ),
            }}>
            {helper.view}
          </Button>
        ))}
      </div>
    </div>
  );
};
