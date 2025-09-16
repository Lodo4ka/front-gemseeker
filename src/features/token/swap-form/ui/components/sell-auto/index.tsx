import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { $typeAutoSell, selectedType, expiryHours, amountSellAuto } from '../../../model/create-limit-order';
import { Button } from 'shared/ui/button';
import { Select } from '../select';
import { Input } from 'shared/ui/input';

export type SellAutoProps = {
  className?: string;
};

export const SellAuto = ({ className }: SellAutoProps) => {
  const [type, changeType] = useUnit([$typeAutoSell, selectedType]);
  const [expiryHoursValue, expiryHoursFieldUpdated] = useUnit([expiryHours.$value, expiryHours.fieldUpdated]);
  const [amountSellAutoValue, amountSellAutoFieldUpdated] = useUnit([amountSellAuto.$value, amountSellAuto.fieldUpdated]);

  return (
    <div className={clsx('flex w-full flex-col', className)}>
      <div className="gap- mb-6 flex w-full items-center gap-2">
        <Button
          theme="darkGray"
          className={{
            button: clsx('text-secondary w-full', { '!text-primary !bg-darkGray-2': type === 'Stop Loss' }),
          }}
          onClick={() => changeType('Stop Loss')}>
          Stop Loss
        </Button>
        <Button
          theme="darkGray"
          className={{
            button: clsx('text-secondary w-full', { '!text-primary !bg-darkGray-2': type === 'Take Profit' }),
          }}
          onClick={() => changeType('Take Profit')}>
          Take Profit
        </Button>
      </div>
      <Select />
      <Input
        value={amountSellAutoValue}
        onValue={amountSellAutoFieldUpdated}
        label="Sell Amount"
        placeholder="24"
        theme="tertiary"
        rightAddon={{ text: '%', className: 'text-[14px] font-regular, text-secondary' }}
        classNames={{
          container: 'w-full my-4 pt-4 border-separator border-t-[0.5px]',
          flex: '!pr-3',
          input: '!text-[14px]',
          label: '!text-[12px]',
        }}
      />
      <Input
        label="Expires in hrs"
        value={expiryHoursValue}
        onValue={expiryHoursFieldUpdated}
        placeholder="24"
        theme="tertiary"
        classNames={{ container: 'w-full', flex: '!pr-3', input: '!text-[14px]', label: '!text-[12px]' }}
      />
    </div>
  );
};
