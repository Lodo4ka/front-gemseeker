import { useUnit } from 'effector-react';
import { amountUpdated, $walletsAmounts } from 'entities/wallet';
import { Input } from 'shared/ui/input';

type DepositInputProps = {
  wallet_id: number;
};

export const DepositInput = ({ wallet_id }: DepositInputProps) => {
  const { ref: walletsAmounts } = useUnit($walletsAmounts);
  const changeAmount = useUnit(amountUpdated);

  return (
    <div>
      <Input
        value={walletsAmounts.get(wallet_id)?.amount}
        classNames={{
          container: 'w-[140px] max-sm:w-[100px]',
          flex: 'bg-darkGray-3 !px-3',
          input: 'leading-[20px] h-5 text-[14px]',
        }}
        placeholder="0.00"
        onValue={(amount) => changeAmount({ id: wallet_id, amount })}
        rightAddon={{ icon: 'solana', className: 'text-secondary', size: 16 }}
      />
    </div>
  );
};
