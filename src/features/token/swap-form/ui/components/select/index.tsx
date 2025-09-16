import clsx from 'clsx';
import { useState } from 'react';
import { Icon } from 'shared/ui/icon';
import { Input } from 'shared/ui/input';
import { Popover } from 'shared/ui/popover';
import { Typography } from 'shared/ui/typography';
import { useUnit } from 'effector-react';
import { $currentConditionType, selectedConditionType, options, triggerMcapValue, $mcapTarget, transformTextSelect, $typeAutoSell, $isBuyDipSelected } from '../../../model/create-limit-order';
import { formatter } from 'shared/lib/formatter';
import { $rate } from 'features/exchange-rate';
import { appStarted } from 'shared/config/init';
import { trackMediaQuery } from '@withease/web-api';

export const { desktop } = trackMediaQuery( 
  { desktop: '(min-width: 768px)' }, 
  { setup: appStarted }
);

export const Select = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBuyDipSelected, typeAutoSell] = useUnit([$isBuyDipSelected, $typeAutoSell]);
  const [currentConditionType, changeConditionType] = useUnit([$currentConditionType, selectedConditionType]);
  const [value, onValue] = useUnit([triggerMcapValue.$value, triggerMcapValue.fieldUpdated]);
  const [mcapTarget, rateSol] = useUnit([$mcapTarget, $rate]);
  const isDesktop = useUnit(desktop.$matches);
  const close = () => setIsOpen(false);
  
  return (
    <div className="flex w-full flex-col gap-2">
      <Popover
        isOpen={isOpen}
        onClose={close}
        placement={!isDesktop ? 'right' : 'bottom'}
        className={{
          children: 'bg-darkGray-3 top-full !left-0 !translate-x-0 !rounded-lg p-3',
        }}
        trigger={
          <div className="border-separator bg-darkGray-3 flex w-full overflow-hidden rounded-lg border-[0.5px]">
            <div
              onMouseDown={() => setIsOpen((prev) => !prev)}
              className={clsx(
                'border-r-separator flex min-w-[110px] cursor-pointer items-center justify-between gap-2 border-r-[0.5px] px-3 py-2',
                { '!border-r-none w-full': currentConditionType === 'By target line' },
              )}>
              <Typography color="secondary" weight="regular">
                {transformTextSelect(currentConditionType, isBuyDipSelected, typeAutoSell)}
              </Typography>
              <Icon
                className={clsx('text-secondary -rotate-90 transition-all duration-300 ease-in-out', {
                  '!rotate-90': isOpen,
                })}
                name="arrowLeft"
              />
            </div>
            <Input
              value={value}
              onValue={onValue}
              theme="clear"
              placeholder="0"
              classNames={{
                container: clsx('w-full transition-all duration-300 ease-in-out', {
                  hidden: currentConditionType === 'By target line',
                }),
                flex: '!pl-3',
              }}
              leftAddon={{ text: '≤', className: 'text-[14px] font-regular' }}
              rightAddon={{ text: currentConditionType === 'MC %' ? '%' : '$', className: 'text-[14px] font-regular' }}
            />
          </div>
        }>
        {options.map((option, index) => (
          <Typography
            size="captain1"
            color="secondary"
            icon={{
              name: 'tick',
              className: clsx('opacity-0 transition-all duration-300 ease-in-out', {
                'opacity-100 &> fill-white': currentConditionType === option,
              }),
              size: 14,
              position: 'left',
            }}
            key={option}
            className={clsx('flex cursor-pointer !gap-2 transition-all duration-300 ease-in-out', {
              '!text-primary': currentConditionType === option,
              'border-b-separator border-b-[0.5px] pb-2': index === 0,
              'border-b-separator border-b-[0.5px] py-2': index === 1,
              'pt-2': index === 2,
            })}
            onClick={() => changeConditionType(option)}
          >
            {transformTextSelect(option, isBuyDipSelected, typeAutoSell)}
          </Typography>
        ))}
      </Popover>
      <Typography size="captain1" weight="regular" color="secondary">
        Triggers on: <br /> MC ≤ ${formatter.number.formatSmallNumber(+mcapTarget * rateSol)}, SOL ≤ {formatter.number.formatSmallNumber(+mcapTarget)}
      </Typography>
    </div>
  );
};
