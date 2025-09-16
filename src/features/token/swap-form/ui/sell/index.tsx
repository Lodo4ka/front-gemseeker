import { Checkbox } from 'shared/ui/checkbox';
import { AmountInput } from '../components';
import { useUnit } from 'effector-react';
import { $rateSellTokens, amount } from '../../model/input';
import { sold } from '../../model/sell';
import {
  toggledSellAuto,
  $isSellAutoSelected,
  toggledSellNow,
  $isSellNowSelected,
  toggledInstaSell,
  $isSellInstaSelected,
  createdLimitOrder,
} from '../../model/create-limit-order';
import clsx from 'clsx';
import { Button } from 'shared/ui/button';
import { SellAuto } from '../components/sell-auto';
import { $balanceToken, $token, AdvancedSettingsAccordion } from 'entities/token';
import { $isProcessingTx } from '../../model';
import { showToastFx } from 'shared/lib/toast';
import s from '../style.module.css';
import { formatter } from 'shared/lib/formatter';
import { Icon } from 'shared/ui/icon';

export const Sell = () => {
  const changeAmount = useUnit(amount.fieldUpdated);
  const [balance, isSellNowSelected, isSellAutoSelected] = useUnit([
    $balanceToken,
    $isSellNowSelected,
    $isSellAutoSelected,
  ]);
  const [startTx, createLimitOrder] = useUnit([sold, createdLimitOrder]);
  const [isProcessingTx, value, showToast] = useUnit([$isProcessingTx, amount.$value, showToastFx]);
  const [rateSellTokens, token] = useUnit([$rateSellTokens, $token]);

  const handleSell = () => {
    if (!(+value > 0) && !isSellAutoSelected)
      return showToast({
        message: 'Drive a number greater than 0!',
        options: { type: 'error' },
      });

    if (isSellAutoSelected) return createLimitOrder();

    return startTx();
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-5">
        <Checkbox
          $isChecked={$isSellNowSelected}
          toggled={toggledSellNow}
          switchStyle="yellow"
          label={{ text: 'Sell Now', className: 'text-secondary text-[15px]' }}
        />
        <Checkbox
          $isChecked={$isSellAutoSelected}
          toggled={toggledSellAuto}
          switchStyle="yellow"
          label={{ text: 'Auto Sell', className: 'text-secondary text-[15px]' }}
        />
        <Checkbox
          className={clsx('transition-all duration-300 ease-in-out', { 'opacity-0': !isSellNowSelected })}
          variant="switch"
          $isChecked={$isSellInstaSelected}
          toggled={toggledInstaSell}
          switchStyle="yellow"
          label={{ text: 'Insta Sell', className: 'text-secondary text-[15px]' }}
        />
      </div>
      <div className="flex w-full flex-col gap-4">
        <AmountInput
          type="SELL"
          className={clsx({ hidden: isSellAutoSelected })}
          helpers={[
            {
              view: '25%',
              onClick: () => changeAmount(String(balance * 0.25)),
            },
            {
              view: '50%',
              onClick: () => changeAmount(String(balance * 0.5)),
            },
            {
              view: '75%',
              onClick: () => changeAmount(String(balance * 0.75)),
            },
            {
              view: '100%',
              onClick: () => changeAmount(String(balance)),
            },
          ]}
        />
        <SellAuto className={clsx({ hidden: !isSellAutoSelected })} />
        <AdvancedSettingsAccordion />
      </div>
      <Button disabled={isProcessingTx} onClick={handleSell} className={{ button: 'h-11' }} theme="red">
        {!isProcessingTx ? (
          value.length > 0 && value !== '0' && +value > 0 ? (
            <div className="flex w-full justify-between gap-1">
              <p>
                Sell {formatter.number.formatSmallNumber(+value)} {token?.symbol.toLocaleUpperCase()}
              </p>
              <p className="flex gap-[4px]">
                <Icon name="solana" /> {formatter.number.formatSmallNumber(rateSellTokens)}
              </p>
            </div>
          ) : (
            'Sell'
          )
        ) : (
          <div className={s.loader} />
        )}
      </Button>
    </div>
  );
};
