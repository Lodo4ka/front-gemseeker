import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { Button } from 'shared/ui/button';
import { Checkbox } from 'shared/ui/checkbox';
import { Input } from 'shared/ui/input';
import { Typography } from 'shared/ui/typography';
import {
  changedSpeed,
  $speed,
  $smartMevProtection,
  toggledSmartMevProtection,
  $isBuyQuick,
  toggledBuyQuick,
  toggledSellQuick,
  $slippage,
  $briberyAmount,
  changedSlippage,
  changedPriorityFee,
  $priorityFee,
  changedBriberyAmount,
  $amount,
  changedAmount,
} from '../../../model/swap-advanced-settings';
import { Accordion } from 'shared/ui/accordion';
import { ModalDefault } from 'shared/ui/modal';
import { MODAL_KEYS } from '../../../config';
import { AmountInput } from '../amount-input';
interface AdvancedSettingsProps {
  isHideAmount?: boolean;
  presets?: boolean;
}

export const AdvancedSettings = ({ isHideAmount, presets = false }: AdvancedSettingsProps) => {
  const [speed, changeSpeed] = useUnit([$speed, changedSpeed]);
  const [slippage, changeSlippage] = useUnit([$slippage, changedSlippage]);
  const [priorityFee, changePriorityFee] = useUnit([$priorityFee, changedPriorityFee]);
  const [briberyAmount, changeBriberyAmount] = useUnit([$briberyAmount, changedBriberyAmount]);
  const [amount, changeAmount] = useUnit([$amount, changedAmount]);

  const handleAmountChange = (value: string) => {
    if (value.includes('%')) {
      changeAmount({ amount: value, type: 'percent' });
    } else {
      changeAmount({ amount: value, type: 'amount' });
    }
  };
  return (
    <div className="flex w-full flex-col gap-4 pt-4">
      <div className="flex w-full gap-[10px]">
        <Input
          label="Slippage %"
          placeholder="20.0"
          value={slippage}
          onValue={changeSlippage}
          theme="tertiary"
          classNames={{
            container: '2lg:w-[198px] 2lg:max-w-[198px] w-[calc((100%-10px)/2)]',
            flex: '!pr-3',
            input: '!text-[14px]',
            label: '!text-[12px]',
          }}
        />
        <div className="flex flex-col gap-4">
          <Typography size="captain1">Smart-Mev protection</Typography>
          <div className="flex items-center gap-3">
            <Typography size="subheadline1" color="secondary">
              Fast
            </Typography>
            <Checkbox
              variant="switch"
              $isChecked={$smartMevProtection}
              toggled={toggledSmartMevProtection}
              switchStyle="yellow"
            />
            <Typography size="subheadline1" color="secondary">
              Secure
            </Typography>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <Typography size="captain1">Set Speed</Typography>
        <div className="flex w-full gap-[10px]">
          <Button
            theme="darkGray"
            className={{
              button: clsx('text-secondary w-full', { '!text-primary !bg-darkGray-2': speed === 'default' }),
            }}
            onClick={() => changeSpeed('default')}>
            Default
          </Button>
          <Button
            theme="darkGray"
            className={{
              button: clsx('text-secondary w-full', { '!text-primary !bg-darkGray-2': speed === 'auto' }),
            }}
            onClick={() => changeSpeed('auto')}>
            Auto
          </Button>
        </div>
      </div>
      <div className="flex w-full gap-[10px]">
        <Input
          label="Priority Fee"
          placeholder="0.008"
          value={priorityFee}
          onValue={changePriorityFee}
          disabled={speed === 'auto'}
          rightAddon={{
            icon: 'solana',
            size: 16,
            className: 'text-secondary',
          }}
          theme="tertiary"
          classNames={{
            container: '2lg:max-w-[198px] w-full',
            flex: '!pr-3',
            input: '!text-[14px]',
            label: '!text-[12px]',
          }}
        />
        <Input
          label="Bribery Amount "
          value={briberyAmount}
          onValue={changeBriberyAmount}
          disabled={speed === 'auto'}
          placeholder="0.0012"
          rightAddon={{
            icon: 'solana',
            size: 16,
            className: 'text-secondary',
          }}
          theme="tertiary"
          classNames={{
            container: '2lg:max-w-[198px] w-full',
            flex: '!pr-3',
            input: '!text-[14px]',
            label: '!text-[12px]',
          }}
        />
      </div>

      {!isHideAmount && (
        <div>
          <Input
            label="Amount"
            placeholder="0"
            type="number"
            min={0}
            value={amount.amount}
            onValue={handleAmountChange}
          />
        </div>
      )}
      {presets && <AmountInput />}
    </div>
  );
};

export const AdvancedSettingsAccordion = () => (
  <Accordion
    className={{
      // border-t-separator border-t-[0.5px]
      root: 'pt-4',
    }}
    header={{
      position: 'left',
      content: (
        <Typography
          icon={{ position: 'left', size: 20, name: 'settings' }}
          size="subheadline1"
          color="secondary"
          className="!gap-2">
          Advanced Settings
        </Typography>
      ),
    }}>
    <AdvancedSettings isHideAmount />
  </Accordion>
);

const wrapperTabClass = 'bg-darkGray-1 w-full gap-1 rounded-xl border-none p-1';
const tabClass = 'w-full !rounded-xl !border-r-0 !border-r-transparent';
const tabActiveClass = '!bg-darkGray-2';

const AdvancedSettingsModalUi = () => {
  const [isBuyQuick, toggleBuyQuick, toggleSellQuick] = useUnit([$isBuyQuick, toggledBuyQuick, toggledSellQuick]);
  return (
    <ModalDefault
      header={{
        children: 'Advanced Settings',
        weight: 'medium',
        size: 'subheadline1',
        color: 'primary',
        className: 'text-primary',
      }}
      classNames={{
        content: 'flex flex-col gap-2 w-full',
        wrapper: '!bg-bg max-w-[380px]',
      }}
      id={MODAL_KEYS.advancedSettings}>
      <div className={clsx('flex items-center gap-1', wrapperTabClass)}>
        <Button
          className={{
            button: clsx(tabClass, {
              [tabActiveClass]: isBuyQuick,
            }),
          }}
          theme="tertiary"
          onClick={toggleBuyQuick}>
          Buy
        </Button>
        <Button
          className={{
            button: clsx(tabClass, {
              [tabActiveClass]: !isBuyQuick,
            }),
          }}
          theme="tertiary"
          onClick={toggleSellQuick}>
          Sell
        </Button>
      </div>
      <AdvancedSettings isHideAmount presets />
    </ModalDefault>
  );
};

export const AdvancedSettingsModal = {
  Modal: AdvancedSettingsModalUi,
  isOpen: false,
  props: {
    id: MODAL_KEYS.advancedSettings,
  },
};
