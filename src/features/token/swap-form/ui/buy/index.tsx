import { Checkbox } from 'shared/ui/checkbox';
import {
  $isBuyDipSelected,
  toggledBuyDip,
  toggledBuyNow,
  $isBuyNowSelected,
  $isBuyInstaSelected,
  toggledInstaBuy,
  createdLimitOrder,
} from '../../model/create-limit-order';
import { buyed } from '../../model/buy';
import { AmountInput, BuyDip } from '../components';
import { useUnit } from 'effector-react';
import { resetAmount, amount, $rateBuyTokens } from '../../model/input';
import clsx from 'clsx';
import { Button } from 'shared/ui/button';
import { $token, AdvancedSettingsAccordion } from 'entities/token';
import { $isProcessingTx } from '../../model';
import { showToastFx } from 'shared/lib/toast';
import s from '../style.module.css';
import { formatter } from 'shared/lib/formatter';
import { Icon } from 'shared/ui/icon';

export const Buy = () => {
  const [reset, changeAmount] = useUnit([resetAmount, amount.fieldUpdated]);
  const [isBuyNowSelected, isBuyDipSelected] = useUnit([$isBuyNowSelected, $isBuyDipSelected]);
  const [isProcessingTx, value, showToast] = useUnit([$isProcessingTx, amount.$value, showToastFx]);
  const [startTx, createLimitOrder] = useUnit([buyed, createdLimitOrder]);
  const [rateBuyTokens, token] = useUnit([$rateBuyTokens, $token]);

  const handleBuy = () => {
    if (!(+value > 0))
      return showToast({
        message: 'Drive a number greater than 0!',
        options: { type: 'error' }
      });

    if (isBuyDipSelected) return createLimitOrder();
    return startTx();
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="max-2lg:justify-between flex items-center gap-5">
        <Checkbox
          $isChecked={$isBuyNowSelected}
          toggled={toggledBuyNow}
          switchStyle="yellow"
          label={{ text: 'Buy Now', className: 'text-secondary text-[15px]' }}
        />
        <Checkbox
          $isChecked={$isBuyDipSelected}
          toggled={toggledBuyDip}
          switchStyle="yellow"
          label={{ text: 'Buy Dip', className: 'text-secondary text-[15px]' }}
        />
        <Checkbox
          variant="switch"
          className={clsx('transition-all duration-300 ease-in-out', { 'opacity-0': !isBuyNowSelected })}
          $isChecked={$isBuyInstaSelected}
          toggled={toggledInstaBuy}
          switchStyle="yellow"
          label={{ text: 'Insta Buy', className: 'text-secondary text-[15px]' }}
        />
      </div>
      <div className="flex w-full flex-col gap-4">
        <AmountInput
          type="BUY"
          helpers={[
            {
              view: 'Reset',
              onClick: reset,
            },
            {
              view: '0.2',
              onClick: () => changeAmount('0.2'),
            },
            {
              view: '0.4',
              onClick: () => changeAmount('0.4'),
            },
            {
              view: '0.6',
              onClick: () => changeAmount('0.6'),
            },
            {
              view: '0.8',
              onClick: () => changeAmount('0.8'),
            },
          ]}
        />

        <BuyDip className={clsx({ hidden: !isBuyDipSelected })} />
        <AdvancedSettingsAccordion />
      </div>

      <Button disabled={isProcessingTx} onClick={handleBuy} className={{ button: 'h-11' }} theme="green">
        {!isProcessingTx ? (
          value.length > 0 && value !== '0' && +value > 0 ? (
            <div className="flex w-full justify-between gap-1">
              <p className="flex gap-[4px]">
                Buy {token?.symbol.toLocaleUpperCase()} for <Icon name="solana" />{' '}
                {formatter.number.formatSmallNumber(+value)}
              </p>
              <p>
                {formatter.number.formatSmallNumber(rateBuyTokens)} {token?.symbol.toLocaleUpperCase()}
              </p>
            </div>
          ) : (
            'Buy'
          )
        ) : (
          <div className={s.loader} />
        )}
      </Button>
    </div>
  );
};
