import { useUnit } from 'effector-react';
import { pnlLoaded, $currentPeriod, changeCurrentPeriod, $pnl } from 'entities/user';
import clsx from 'clsx';
import { timeframes } from '../../config/pnl';
import { Typography } from 'shared/ui/typography';
import { Button } from 'shared/ui/button';
import { LoadedData } from 'shared/ui/loaded-data';
import { Skeleton } from 'shared/ui/skeleton';
import { formatter } from 'shared/lib/formatter/index';
import { PnlPeriodKeys } from 'entities/user';
import { $isRefreshing, refreshed } from '../../model/pnl';
import { PnlChart } from './chart';
import { $isChecked } from '../../model/checkbox';

export type PnlProps = {
  fallback?: boolean;
};

export const Pnl = ({ fallback = false }: PnlProps) => {
  const [currentPeriod, currentPnl, isSolana] = useUnit([$currentPeriod, $pnl, $isChecked]);
  const changePeriod = useUnit(changeCurrentPeriod);
  const [isRefreshing, refresh] = useUnit([$isRefreshing, refreshed]);

  if (fallback) return <PnlFallback isLoad={true} />;

  return (
    <div className="bg-darkGray-1 w-full flex-col rounded-xl p-4">
      <div className="flex items-center gap-2">
        <Typography size="subheadline2" color="secondary" weight="regular">
          Pnl
        </Typography>
        <Button
          disabled={isRefreshing}
          theme="quaternary"
          onClick={refresh}
          icon={{ position: 'center', name: 'refresh', size: 10 }}
          className={{
            icon: clsx('text-primary', { 'animate-spin': isRefreshing }),
            button: clsx('h-[18px] w-[18px] rounded-sm !p-0', { disabled: isRefreshing }),
          }}
        />
      </div>
      {currentPnl && (
        <div className="mt-1 flex items-end gap-1">
          {!isSolana ? (
            <Typography size="headline2">{formatter.number.uiDefaultWithDollar(currentPnl.whole_pnl.pnl)}</Typography>
          ) : (
            <Typography size="headline2" icon={{ name: 'solana', size: 18, position: 'left' }}>
              {formatter.number.uiDefault(currentPnl.whole_pnl.pnl_sol)}
            </Typography>
          )}
          <Typography size="subheadline2" color={currentPnl.whole_pnl.pnl_percentage >= 0 ? 'green' : 'red'}>
            {formatter.number.uiDefault(currentPnl.whole_pnl.pnl_percentage)}%
          </Typography>
        </div>
      )}
      {!currentPnl && (
        <div className="mt-1 flex items-end gap-1">
          <Skeleton isLoading className="h-8 w-24 rounded" />
          <Skeleton isLoading className="ml-2 h-4 w-12 rounded" />
        </div>
      )}
      <div className="mt-[14px] mb-5 flex items-center gap-[10px]">
        {Object.entries(timeframes).map(([key, value]) => (
          <Button
            onClick={() => changePeriod(Number(key) as PnlPeriodKeys)}
            key={key}
            className={{
              button: clsx('text-secondary !h-9 rounded-lg !px-3 !py-2', {
                '!bg-darkGray-2': currentPeriod === Number(key),
              }),
            }}
            theme="darkGray">
            {value}
          </Button>
        ))}
        <Button
          onClick={() => changePeriod('All')}
          className={{
            button: clsx('text-secondary !h-9 rounded-lg !px-3 !py-2', { '!bg-darkGray-2': currentPeriod === 'All' }),
          }}
          theme="darkGray">
          All
        </Button>
      </div>
      <PnlChart />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        {!currentPnl &&
          [...Array(6)].map((_, i) => (
            <div key={i} className="flex w-[110px] flex-col items-start gap-1">
              <Skeleton isLoading className="h-4 w-20 rounded" />
              <Skeleton isLoading className="h-6 w-16 rounded" />
            </div>
          ))}
        {currentPnl && (
          <>
            <div className="flex w-[110px] flex-col items-start gap-1">
              <Typography size="subheadline2" color="secondary" weight="regular">
                Realized PnL
              </Typography>
              {!isSolana ? (
                <Typography size="subheadline1" color={currentPnl.whole_pnl.realised_pnl >= 0 ? 'green' : 'red'}>
                  {formatter.number.uiDefaultWithDollar(currentPnl.whole_pnl.realised_pnl)}
                </Typography>
              ) : (
                <Typography
                  size="subheadline1"
                  color={currentPnl.whole_pnl.realised_pnl >= 0 ? 'green' : 'red'}
                  icon={{ name: 'solana', size: 18, position: 'left' }}>
                  {formatter.number.uiDefault(currentPnl.whole_pnl.realised_pnl_sol)}
                </Typography>
              )}
            </div>
            <div className="flex w-[110px] flex-col items-start gap-1">
              <Typography size="subheadline2" color="secondary" weight="regular">
                Unrealized PnL
              </Typography>
              {!isSolana ? (
                <Typography size="subheadline1" color={currentPnl.whole_pnl.unrealised_pnl >= 0 ? 'green' : 'red'}>
                  {formatter.number.uiDefaultWithDollar(currentPnl.whole_pnl.unrealised_pnl)}
                </Typography>
              ) : (
                <Typography
                  size="subheadline1"
                  color={currentPnl.whole_pnl.unrealised_pnl >= 0 ? 'green' : 'red'}
                  icon={{ name: 'solana', size: 18, position: 'left' }}>
                  {formatter.number.uiDefault(currentPnl.whole_pnl.unrealised_pnl_sol)}
                </Typography>
              )}
            </div>
            <div className="flex w-[110px] flex-col items-start gap-1">
              <Typography size="subheadline2" color="secondary" weight="regular">
                Total Revenue
              </Typography>
              {!isSolana ? (
                <Typography size="subheadline1" color={currentPnl.whole_pnl.revenue >= 0 ? 'green' : 'red'}>
                  {formatter.number.uiDefaultWithDollar(currentPnl.whole_pnl.revenue)}
                </Typography>
              ) : (
                <Typography
                  size="subheadline1"
                  color={currentPnl.whole_pnl.revenue >= 0 ? 'green' : 'red'}
                  icon={{ name: 'solana', size: 18, position: 'left' }}>
                  {formatter.number.uiDefault(currentPnl.whole_pnl.revenue_sol)}
                </Typography>
              )}
            </div>
            <div className="flex w-[110px] flex-col items-start gap-1">
              <Typography size="subheadline2" color="secondary" weight="regular">
                Total Spent
              </Typography>
              {!isSolana ? (
                <Typography size="subheadline1" color={currentPnl.whole_pnl.spent >= 0 ? 'green' : 'red'}>
                  {formatter.number.uiDefaultWithDollar(currentPnl.whole_pnl.spent)}
                </Typography>
              ) : (
                <Typography
                  size="subheadline1"
                  color={currentPnl.whole_pnl.spent >= 0 ? 'green' : 'red'}
                  icon={{ name: 'solana', size: 18, position: 'left' }}>
                  {formatter.number.uiDefault(currentPnl.whole_pnl.spent_sol)}
                </Typography>
              )}
            </div>
            <div className="flex w-[110px] flex-col items-start gap-1">
              <Typography size="subheadline2" color="secondary" weight="regular">
                Invested
              </Typography>
              {!isSolana ? (
                <Typography size="subheadline1">
                  {formatter.number.uiDefaultWithDollar(currentPnl.whole_pnl.invested)}
                </Typography>
              ) : (
                <Typography
                  size="subheadline1"
                  icon={{ name: 'solana', size: 18, position: 'left' }}
                  color="primary"
                  weight="regular">
                  {formatter.number.uiDefault(currentPnl.whole_pnl.invested_sol)}
                </Typography>
              )}
            </div>
            <div className="flex w-[110px] flex-col items-start gap-1">
              <Typography size="subheadline2" color="secondary" weight="regular">
                Sold
              </Typography>
              {!isSolana ? (
                <Typography size="subheadline1">
                  {formatter.number.uiDefaultWithDollar(currentPnl.whole_pnl.sold)}
                </Typography>
              ) : (
                <Typography size="subheadline1" icon={{ name: 'solana', size: 18, position: 'left' }}>
                  {formatter.number.uiDefault(currentPnl.whole_pnl.sold_sol)}
                </Typography>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const PnlFallback = ({ isLoad = false }: { isLoad?: boolean }) => (
  <div className="bg-darkGray-1 w-full flex-col rounded-xl p-4">
    {isLoad && <LoadedData isOnce loadedData={pnlLoaded} />}
    <div className="mb-2">
      <Skeleton isLoading className="h-4 w-16 rounded" />
    </div>
    <div className="mt-1 flex items-end gap-1">
      <Skeleton isLoading className="h-8 w-24 rounded" />
      <Skeleton isLoading className="ml-2 h-4 w-12 rounded" />
    </div>
    <div className="mt-[14px] mb-5 flex items-center gap-[10px]">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} isLoading className="h-9 w-14 rounded-lg" />
      ))}
    </div>
    <div className="relative h-[312px] w-full border-b-[0.5px] border-b-[#282E3E] pb-1">
      <Skeleton isLoading className="absolute top-0 left-0 h-full w-full rounded" />
    </div>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex w-[110px] flex-col items-start gap-1">
          <Skeleton isLoading className="h-4 w-20 rounded" />
          <Skeleton isLoading className="h-6 w-16 rounded" />
        </div>
      ))}
    </div>
  </div>
);
