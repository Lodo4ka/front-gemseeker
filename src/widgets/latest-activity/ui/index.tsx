import { useUnit } from 'effector-react';

import { LatestTransaction, LatestTransactionFallback } from 'entities/transaction';
import { Skeleton } from 'shared/ui/skeleton';

import { $activityTx, activityTxLoaded } from '../model';
import { LoadedData } from 'shared/ui/loaded-data';
import { isDesktop } from '../config';
import { HeadPause } from 'shared/ui/head-pause';
import { useState, useRef, useEffect } from 'react';
import { RecentResponse } from 'shared/api/queries/transaction/list';
export const RecentActivity = () => {
  const [activityTx, isDesktopWindow] = useUnit([$activityTx, isDesktop.$matches]);

  const [isUpdated, setIsUpdated] = useState(false);

  const prevTxRef = useRef<RecentResponse[0] | null>(null);

  useEffect(() => {
    if (!prevTxRef.current) {
      prevTxRef.current = activityTx?.[0] ?? null;
      return;
    }

    const isChanged = ['type', 'slug', 'token_address'].some(
      (key) =>
        prevTxRef.current?.[key as keyof RecentResponse[0]] !== activityTx?.[0]?.[key as keyof RecentResponse[0]],
    );

    if (isChanged) {
      setIsUpdated(true);
      const timer = setTimeout(() => setIsUpdated(false), 800);
      return () => clearTimeout(timer);
    }

    prevTxRef.current = activityTx?.[0] ?? null;
  }, [activityTx]);

  // Always render LoadedData for refresh functionality
  const loadedDataComponent = <LoadedData loadedData={activityTxLoaded} />;

  if (!activityTx)
    return (
      <>
        {loadedDataComponent}
        <RecentActivityFallback />
      </>
    );

  if (isDesktopWindow)
    return (
      <div className="hidden w-full min-w-[320px] flex-col gap-2 md:gap-4 lg:flex">
        {loadedDataComponent}
        <HeadPause title="Recent activity" pauseVariant="activity" iconName="transaction" />
        <div className="flex w-full flex-col gap-4">
          {activityTx.slice(0, 3)?.map((tx, idx) => {
            if (idx === 0)
              return (
                <div
                  key={tx.hash ?? tx.slug}
                  className="flex w-full min-w-[0px] flex-[0_0_100%] items-center rounded-lg md:flex-[0_0_50%] xl:flex-[auto]">
                  <LatestTransaction isUpdated={isUpdated} variantPause="activity" transaction={tx} />
                </div>
              );
            return (
              <LatestTransaction
                key={tx.hash ?? tx.slug}
                className="min-w-[0px] flex-[0_0_100%] md:flex-[0_0_50%] xl:flex-[auto]"
                variantPause="activity"
                transaction={tx}
              />
            );
          })}
        </div>
      </div>
    );

  return null;
};

export const RecentActivityFallback = () => {
  const LatestTransactions = Array(3)
    .fill(null)
    .map((_, idx) => (
      <div key={idx} className="min-w-[0px] flex-[0_0_100%] pl-[10px] md:flex-[0_0_50%] xl:flex-[auto] xl:pl-[0px]">
        <LatestTransactionFallback />
      </div>
    ));

  return (
    <div className="relative hidden w-full flex-col gap-2 md:gap-4 lg:flex">
      <div className="flex items-center gap-2">
        <Skeleton isLoading className="h-5 w-5" />
        <Skeleton isLoading className="h-5 w-24" />
      </div>

      <div className="flex w-full flex-col gap-[10px]">{LatestTransactions}</div>
    </div>
  );
};
