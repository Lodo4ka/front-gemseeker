import { useUnit } from 'effector-react';
import { Icon } from 'shared/ui/icon';
import { Input } from 'shared/ui/input';
import { Typography } from 'shared/ui/typography';
import { toggledToken, $currentToken, $$tokenForm, $rateBuyTokens } from '../../model';
import clsx from 'clsx';
import { $balanceCastodial } from 'entities/wallet';
import { useForm } from '@effector-reform/react';
import { formatter } from 'shared/lib/formatter';

export const InputBuy = ({ disabled }: { disabled: boolean }) => {
  const toggleToken = useUnit(toggledToken);
  const [currentToken, balance] = useUnit([$currentToken, $balanceCastodial]);
  const { fields } = useForm($$tokenForm);
  const rateBuyTokens = useUnit($rateBuyTokens);
  const ticker = fields.ticker.value;
  const tickerUI = ticker.length === 0 ? 'TOKEN' : ticker.toLocaleUpperCase();

  return (
    <div className="border-b-separator flex w-full flex-col gap-2 border-b-[0.5px] pb-6">
      <div className="flex w-full items-center justify-between">
        <Typography size="subheadline2" weight="regular">
          Choose how many you want to buy
        </Typography>
        <div className="flex items-center gap-2">
          <Typography
            weight="regular"
            className={clsx('transition-all duration-300 ease-in-out', {
              'text-secondary': currentToken === 'TOKEN',
              'opacity-50': disabled,
            })}
            size="subheadline2">
            SOL
          </Typography>
          <Icon className={clsx("cursor-pointer", { 'opacity-50 !cursor-auto': disabled })} onClick={!disabled ? toggleToken : undefined} name="exchange" />
          <Typography
            className={clsx('transition-all duration-300 ease-in-out', {
              'text-secondary': currentToken === 'SOL',
              'opacity-50': disabled,
            })}
            weight="regular"
            size="subheadline2">
            {tickerUI}
          </Typography>
        </div>
      </div>
      <Input
        disabled={disabled}
        value={fields.amount_to_buy.value}
        onValue={fields.amount_to_buy.onChange}
        error={fields.amount_to_buy.error}
        placeholder="0.5"
        rightAddon={{
          text: (
            <Typography
              as="button"
              type="button"
              onClick={() => fields.amount_to_buy.onChange(String(balance))}
              size="captain1"
              color="secondary"
              icon={{ position: 'right', name: 'solana', size: 14 }}>
              Bal: {balance}
            </Typography>
          ),
        }}
        classNames={{ container: 'w-full', flex: 'bg-darkGray-3 max-2lg:bg-darkGray-1' }}
      />
      <Typography size="captain1" weight="regular" color="secondary">
        {currentToken === 'SOL' ? 
          `You will get: ${formatter.number.uiDefault(rateBuyTokens)} ${tickerUI}`
          :
          `You will give: ${formatter.number.uiDefault(rateBuyTokens)} SOL`
        }
        
      </Typography>
    </div>
  );
};
