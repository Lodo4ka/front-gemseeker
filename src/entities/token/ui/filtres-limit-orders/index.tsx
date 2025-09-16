import { useState } from 'react';

import { Button } from 'shared/ui/button';
import { SelectWallet } from 'entities/wallet';
import { Popover } from 'shared/ui/popover';
import { Checkbox } from 'shared/ui/checkbox';
import { 
  $isActiveChecked,
  $isSuccessChecked,
  $isFailedChecked,
  $isBuyDipChecked,
  $isStopLossChecked,
  $isTakeProfitChecked,
  toggleActive, 
  toggleSuccess, 
  toggleFailed, 
  toggleBuyDip, 
  toggleStopLoss, 
  toggleTakeProfit, 
  $isCanceledChecked,
  toggleCanceled
} from '../../model/filtres-limit-orders';

export const FiltresLimitOrders = () => {

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return(
    <div className='flex items-center gap-[12px]'>
      <Popover
        isOpen={isPopoverOpen}
        onClose={() => setIsPopoverOpen(false)}
        className={{
          children: ''
        }}
        trigger={
          <Button 
            theme='secondary'
            className={{
              button: 'w-[36px] h-[36px] rounded-[8px] border-[0.5px] border-[#2E3547] !p-0',
              icon: 'w-[18px] h-[18px]'
            }}
            icon={{
              name: 'settings',
              position: 'left',
              size: 18,
            }}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          />
        }
      >
        <div className='flex flex-col gap-y-[9px] p-[8px] min-w-[120px]'>
          {/* First group of checkboxes */}
          <Checkbox 
            variant='square'
            $isChecked={$isActiveChecked}
            toggled={toggleActive}
            label={{ text: 'Active' }}
          />
          <Checkbox 
            variant='square'
            $isChecked={$isSuccessChecked}
            toggled={toggleSuccess}
            label={{ text: 'Success' }}
          />
          <Checkbox 
            variant='square'
            $isChecked={$isFailedChecked}
            toggled={toggleFailed}
            label={{ text: 'Failed' }}
          />
          <Checkbox 
            variant='square'
            $isChecked={$isCanceledChecked}
            toggled={toggleCanceled}
            label={{ text: 'Сancelled' }}
          />
          
          {/* Separator */}
          <div className='border-t-[0.5px] border-separator'></div>
          
          {/* Second group of checkboxes */}
          <Checkbox 
            variant='square'
            $isChecked={$isBuyDipChecked}
            toggled={toggleBuyDip}
            label={{ text: 'Buy Dip' }}
          />
          <Checkbox 
            variant='square'
            $isChecked={$isStopLossChecked}
            toggled={toggleStopLoss}
            label={{ text: 'Stop Loss' }}
          />
          <Checkbox 
            variant='square'
            $isChecked={$isTakeProfitChecked}
            toggled={toggleTakeProfit}
            label={{ text: 'Take Profit' }}
          />
        </div>
      </Popover>

      <SelectWallet />
    </div>
  )
}