import { useUnit } from 'effector-react';
import { router } from 'shared/config/router';
import { $token, $isLoading, Progress } from 'entities/token';
import { Icon } from 'shared/ui/icon';

import { Actions, ActionsSkeleton } from './actions';
import { Stats, StatsSkeleton } from './stats';
import { MainInfo, MainInfoSkeleton } from './main-info';
import { Skeleton } from 'shared/ui/skeleton';
import { Typography } from 'shared/ui/typography';
import { formatter } from 'shared/lib/formatter';
import { $rate } from 'features/exchange-rate';
export type TokenHeaderProps = {
  isFallback?: boolean;
};

export const TokenHeader = ({ isFallback = false }: TokenHeaderProps) => {
  const goBack = useUnit(router.back);
  const [token, rate, isLoading] = useUnit([$token, $rate, $isLoading]);

  if (isLoading || !token || isFallback) return <TokenHeaderFallback />;

  return (
    <div className="lg:bg-darkGray-1 flex w-full gap-8 rounded-xl px-4 py-3 max-xl:gap-4 max-lg:flex-col max-lg:p-0 lg:items-center">
      <div className="flex min-w-0 gap-[6px] max-lg:flex-col lg:items-center">
        <div className="flex w-full items-center justify-between gap-2">
          <Icon className="text-secondary cursor-pointer" name="arrowLeft" onClick={goBack} size={16} />

          <div className="flex items-center gap-2 lg:hidden">
            <Typography size="subheadline1">ATH</Typography>
            <Progress
              prev_ath={token.prev_ath}
              ath={token.ath}
              current={token.mcap}
              between={
                <Typography size="subheadline1">
                  MC: ${formatter.number.formatSmallNumber(token.mcap * rate)}
                </Typography>
              }
              lastTxTimestamp={token.last_tx_timestamp}
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <MainInfo token={token} />
          <Actions
            className={{
              container: 'lg:hidden',
              button: {
                button: 'max-lg:text-secondary max-[660px]:min-h-8 max-[660px]:min-w-8 max-[660px]:p-0',
                span: 'max-[660px]:hidden',
                icon: 'max-lg:text-secondary',
              },
            }}
          />
        </div>
      </div>
      <div className="bg-separator h-[50px] w-[0.5px] max-lg:h-[0.5px] max-lg:w-full" />
      <div className="flex flex-1 items-center justify-between max-lg:w-full">
        <Stats token={token} />
        <Actions className={{ container: 'max-lg:hidden', button: { span: 'max-xl:hidden' } }} />
      </div>
    </div>
  );
};

const TokenHeaderFallback = () => (
  <div className="lg:bg-darkGray-1 flex w-full gap-8 rounded-xl px-4 py-3 max-xl:gap-4 max-lg:flex-col max-lg:p-0 lg:items-center">
    <div className="flex min-w-0 gap-3 max-lg:flex-col lg:items-center">
      <Skeleton isLoading className="h-4 w-4 min-w-4 rounded-full" />
      <div className="flex w-full items-center justify-between">
        <MainInfoSkeleton />
        <ActionsSkeleton
          className={{
            container: 'lg:hidden',
            button: 'max-[660px]:!h-8 max-[660px]:!w-8 max-[660px]:p-0 max-lg:h-[36px] max-lg:w-[110px]',
          }}
        />
      </div>
    </div>
    <div className="bg-separator h-[50px] w-[0.5px] max-lg:h-[0.5px] max-lg:w-full" />
    <div className="flex flex-1 items-center justify-between max-lg:w-full">
      <StatsSkeleton />
      <div className="hidden items-center gap-2 lg:flex">
        <ActionsSkeleton className={{ container: 'max-lg:hidden', button: 'rounded-lg xl:h-[36px] xl:w-[110px]' }} />
      </div>
    </div>
  </div>
);
