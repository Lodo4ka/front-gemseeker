import clsx from 'clsx';
import { useUnit } from 'effector-react';

import { $isProcessingTx, startedTx } from '../../model';
import { Button } from 'shared/ui/button';
import { $isBuyQuick } from 'entities/token';
import { $amount } from 'entities/token';
import { showToastFx } from 'shared/lib/toast';
import { TokensListTokenResponse } from 'shared/api/queries/token/tokens-factory';

interface QuickBuyButtonProps {
  token?: TokensListTokenResponse[0];
  className?: string;
}

export const QuickBuyButton = ({ token, className }: QuickBuyButtonProps) => {
  const [amount, startTx] = useUnit([$amount, startedTx]);
  const [isProcessingTx, isBuy, showToast] = useUnit([$isProcessingTx, $isBuyQuick, showToastFx]);

  const handleBuy = () => {
    if (Number(amount.amount.replace('%', '')) > 0) return startTx(token as TokensListTokenResponse[0]);
    showToast({
      message: 'Drive a number greater than 0!',
      options: { type: 'error' },
    });
  };

  return (
    <Button
      onClick={handleBuy}
      theme="quaternary"
      className={{ button: clsx('!bg-[] rounded-[6px] !py-2 pr-3 pl-2 text-[12px]', className) }}
      style={{
        background: `var(--color-${isBuy ? 'green' : 'red'}-gradient)`,
      }}
      icon={{ name: 'energy', size: 16, position: 'left' }}
      disabled={isProcessingTx === token?.address}
      isLoaderIcon={isProcessingTx === token?.address}>
      {isProcessingTx !== token?.address && amount.amount === '' ? '0' : amount.amount}
    </Button>
  );
};
