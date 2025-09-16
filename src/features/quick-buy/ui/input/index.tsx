import { useUnit } from 'effector-react';
import clsx from 'clsx';

import { Input } from 'shared/ui/input';
import { Skeleton } from 'shared/ui/skeleton';
import { ToggleVariantTx } from '../toggle-variant-tx';
// import { ToggleVariantPayment } from '../toggle-variant-payment';
import { Button } from 'shared/ui/button';
import { Icon } from 'shared/ui/icon';
import { modalsStore } from 'shared/lib/modal';
import { $amount, changedAmount, AdvancedSettingsModal } from 'entities/token';
import s from './style.module.css';

interface QuickBuyInputProps {
  className?: string;
}

export const QuickBuyInput = ({ className }: QuickBuyInputProps) => {
  const [value, onChange] = useUnit([$amount, changedAmount]);
  const openSettingsModal = useUnit(modalsStore.openModal);

  const handleChange = (value: string) => {
    if (value.includes('%')) {
      onChange({ amount: value, type: 'percent' });
    } else {
      onChange({ amount: value, type: 'amount' });
    }
  };
  return (
    <div
      className={clsx(
        'bg-darkGray-3 hidden items-center gap-[5px] rounded-lg py-[2px] pr-[2px] pl-[6px] lg:flex',
        className,
      )}>
      <Button
        onClick={() => openSettingsModal(AdvancedSettingsModal)}
        theme="tertiary"
        // !hidden sm:!flex
        className={{ button: 'min-h-[32px] min-w-[32px] !p-0' }}>
        <Icon name="settings" />
      </Button>

      <ToggleVariantTx />

      <div className="bg-darkGray-1 flex min-h-4 gap-2 rounded-lg py-[6px] pr-[6px] pl-[10px]">
        <Input
          value={value.amount}
          onValue={handleChange}
          placeholder="0"
          classNames={{ container: 'h-5 w-9', flex: '!p-0', input: '!leading-5 !text-[16px]' }}
          theme="clear"
        />
        <Icon name="solana" className={s.solanaIcon} />
        {/* <ToggleVariantPayment /> */}
      </div>
    </div>
  );
};

export const QuickBuyInputFallback = () => {
  return (
    <div className="bg-darkGray-3 flex items-center gap-[10px] rounded-lg py-[2px] pr-[2px] pl-[6px]">
      <div className="flex items-center gap-[2px]">
        <Skeleton isLoading className="h-4 w-4 rounded-lg" />
        <Skeleton isLoading className="h-4 w-8" />
      </div>
      <div className="bg-darkGray-1 flex min-h-4 items-center gap-2 rounded-lg py-[6px] pr-[6px] pl-[10px]">
        <Skeleton isLoading className="h-5 w-12" />
        <Skeleton isLoading className="h-4 w-8 rounded-full" />
      </div>
    </div>
  );
};
