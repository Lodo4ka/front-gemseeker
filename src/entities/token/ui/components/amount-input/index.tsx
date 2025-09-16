import { useUnit } from 'effector-react';
import { $balanceCastodial } from 'entities/wallet';
import { Button } from 'shared/ui/button';
import { Input } from 'shared/ui/input';
import clsx from 'clsx';
import { $amount, $isBuyQuick, changedAmount } from '../../../model/swap-advanced-settings';
import { useMemo } from 'react';
export const AmountInput = () => {
  const [balanceSol, isBuy] = useUnit([$balanceCastodial, $isBuyQuick]);
  const [value, changeAmount] = useUnit([$amount, changedAmount]);

  const helpers = useMemo(() => {
    if (isBuy) {
      return [
        { view: '0.1', onClick: () => changeAmount({ amount: '0.1', type: 'amount' }) },
        { view: '0.2', onClick: () => changeAmount({ amount: '0.2', type: 'amount' }) },
        { view: '0.4', onClick: () => changeAmount({ amount: '0.4', type: 'amount' }) },
        { view: '0.6', onClick: () => changeAmount({ amount: '0.6', type: 'amount' }) },
        { view: '0.8', onClick: () => changeAmount({ amount: '0.8', type: 'amount' }) },
      ];
    }
    return [
      { view: '10%', onClick: () => changeAmount({ amount: '10%', type: 'percent' }) },
      { view: '50%', onClick: () => changeAmount({ amount: '50%', type: 'percent' }) },
      { view: '75%', onClick: () => changeAmount({ amount: '75%', type: 'percent' }) },
      { view: '100%', onClick: () => changeAmount({ amount: '100%', type: 'percent' }) },
    ];
  }, [balanceSol, isBuy]);

  const handleAmountChange = (value: string) => {
    if (value.includes('%')) {
      changeAmount({ amount: value, type: 'percent' });
    } else {
      changeAmount({ amount: value, type: 'amount' });
    }
  };
  return (
    <div className={clsx('flex w-full flex-col gap-5')}>
      <Input label="Amount" placeholder="0" value={value.amount} onValue={handleAmountChange} />
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
