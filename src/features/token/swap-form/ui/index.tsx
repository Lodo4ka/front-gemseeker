import { Tabs } from 'shared/ui/tabs';
import { Buy } from './buy';
import { Sell } from './sell';
import { Skeleton } from 'shared/ui/skeleton';
import { SelectWallet } from './select-wallet';
import { useUnit } from 'effector-react';
import { resettedOrderLimitSettings } from '../model/create-limit-order';
import { MigrateLoading } from './migrate-loading';

export const SwapForm = () => {
  const resetOrderLimitSettings = useUnit(resettedOrderLimitSettings);
  return (
    <div className="2lg:bg-darkGray-1 flex w-full rounded-xl relative">
      <div className='2lg:px-4 2lg:py-5'>
        <Tabs
          onTabChange={resetOrderLimitSettings}
          between={
            <SelectWallet />
          }
          className={{
            wrapper: '!gap-0',
            controllers: {
              wrapper: '2lg:bg-bg bg-darkGray-1 relative z-1 w-full gap-1 rounded-xl border-none p-1',
              controller: {
                default: 'w-full !rounded-xl !border-r-0 !border-r-transparent',
                active: '!bg-darkGray-2',
              },
            },
          }}
          controllers={[
            {
              children: 'Buy',
              name: 'buy'
            },
            {
              children: 'Sell',
              name: 'sell'
            },
          ]}
          queryParamName='type_swap'
          contents={[<Buy />, <Sell />]}
        />
      </div>

      <MigrateLoading />
    </div>
  );
};

export const SwapFormFallback = () => (
  <div className="2lg:bg-darkGray-1 2lg:px-4 2lg:py-5 flex w-full rounded-xl">
    <div className="flex w-full flex-col gap-4">
      {/* Табы */}
      <div className="bg-bg max-2lg:bg-darkGray-1 mt-2 flex w-full gap-1 rounded-xl p-1">
        <Skeleton isLoading className="h-9 w-full rounded-xl" />
        <Skeleton isLoading className="h-9 w-full rounded-xl" />
      </div>
      <div className="border-b-separator w-full border-b-[0.5px] pb-4">
        <Skeleton isLoading className="border-separator h-9 w-full rounded-lg border-[0.5px]" />
      </div>
      {/* Форма */}
      <div className="flex w-full flex-col">
        <div className="max-2lg:justify-between flex items-center gap-5">
          <div className="flex items-center gap-2">
            <Skeleton isLoading className="h-[18px] w-[18px] rounded-full" />
            <Skeleton isLoading className="h-5 w-16 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton isLoading className="h-[18px] w-[18px] rounded-full" />
            <Skeleton isLoading className="h-5 w-14 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton isLoading className="h-5 w-9 rounded-lg" />
            <Skeleton isLoading className="h-5 w-17 rounded" />
          </div>
        </div>
        <div className="mt-6 mb-3 flex items-center gap-2">
          <Skeleton isLoading className="h-5 w-19 rounded" />
          <Skeleton isLoading className="h-6 w-14 rounded" />
        </div>
        <Skeleton isLoading className="!bg-darkGray-3 mb-5 h-9 w-full rounded-lg" />
        <div className="border-separator flex w-full items-center border-[0.5px]">
          <div className="border-r-separator flex w-full items-center justify-center border-r-[0.5px] px-3 py-2">
            <Skeleton isLoading className="h-5 w-10 rounded" />
          </div>
          <div className="border-r-separator flex w-full items-center justify-center border-r-[0.5px] px-3 py-2">
            <Skeleton isLoading className="h-5 w-7 rounded" />
          </div>
          <div className="border-r-separator flex w-full items-center justify-center border-r-[0.5px] px-3 py-2">
            <Skeleton isLoading className="h-5 w-7 rounded" />
          </div>
          <div className="border-r-separator flex w-full items-center justify-center border-r-[0.5px] px-3 py-2">
            <Skeleton isLoading className="h-5 w-7 rounded" />
          </div>
          <div className="flex w-full items-center justify-center px-3 py-2">
            <Skeleton isLoading className="h-5 w-7 rounded" />
          </div>
        </div>
        {/* <div className="bg-separator mt-4 h-[0.5px] w-full" /> */}
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton isLoading className="h-5 w-5 rounded-full" />
          <Skeleton isLoading className="h-5 w-[135px] rounded" />
        </div>
        <Skeleton isLoading className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton isLoading className="mt-2 h-11 w-full rounded-lg" />
    </div>
  </div>
);
