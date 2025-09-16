import { Input } from 'shared/ui/input';
import clsx from 'clsx';
import { Select } from '../select';
import { useUnit } from 'effector-react';
import { expiryHours } from '../../../model/create-limit-order';


export type BuyDipProps = {
  className?: string;
};
export const BuyDip = ({ className }: BuyDipProps) => {
  const [value, onValue] = useUnit([expiryHours.$value, expiryHours.fieldUpdated]);
  
  return (
    <div className={clsx('flex w-full flex-col gap-4 transition-all duration-300 ease-in-out', className)}>
      <Select />
      <Input
        value={value}
        onValue={onValue}
        label="Expires in hrs"
        placeholder="24"
        theme="tertiary"
        classNames={{ container: 'w-full', flex: '!pr-3', input: '!text-[14px]', label: '!text-[12px]' }}
      />
    </div>
  );
};
