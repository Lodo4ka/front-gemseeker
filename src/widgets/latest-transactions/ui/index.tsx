import { useUnit } from 'effector-react';

import { LatestTransaction, LatestTransactionFallback } from 'entities/transaction';
import { Skeleton } from 'shared/ui/skeleton';

import { $recentTx, recentTxLoaded } from '../model';
import { LoadedData } from 'shared/ui/loaded-data';
import { isDesktop } from '../config';
import { HeadPause } from 'shared/ui/head-pause';
import { RecentResponse } from 'shared/api/queries/transaction/list';
import { useState, useRef, useEffect } from 'react';

interface RecentTransactionsProps {
  variant: 'top' | 'side';
}

export const RecentTransactions = ({ variant }: RecentTransactionsProps) => {
  const [recentTx, isDesktopWindow] = useUnit([$recentTx, isDesktop.$matches]);
  const [isUpdated, setIsUpdated] = useState(false);

  const prevTxRef = useRef<RecentResponse[0] | null>(null);

  useEffect(() => {
    if (!prevTxRef.current) {
      prevTxRef.current = recentTx?.[0] ?? null;
      return;
    }

    const isChanged = ['hash', 'type', 'timestamp', 'sol_amount', 'token_amount', 'slug', 'token_address'].some(
      (key) => prevTxRef.current?.[key as keyof RecentResponse[0]] !== recentTx?.[0]?.[key as keyof RecentResponse[0]],
    );

    if (isChanged) {
      setIsUpdated(true);
      const timer = setTimeout(() => setIsUpdated(false), 800);
      return () => clearTimeout(timer);
    }

    prevTxRef.current = recentTx?.[0] ?? null;
  }, [recentTx]);

  // Always render LoadedData for refresh functionality
  const loadedDataComponent = <LoadedData loadedData={recentTxLoaded} />;

  if (!recentTx)
    return (
      <>
        {loadedDataComponent}
        <RecentTransactionsFallback variant={variant} />
      </>
    );

  const LatestTransactions = recentTx.slice(0, 3).map((tx, idx) => {
    if (idx === 0)
      return (
        <div
          key={tx.hash}
          className="min-w-[0px] flex-[0_0_100%] pl-[10px] md:flex-[0_0_50%] xl:flex-[auto] xl:pl-[0px]">
          <LatestTransaction variantPause="recent_tx" transaction={tx} isUpdated={isUpdated} />
        </div>
      );
    return (
      <div key={tx.hash} className="min-w-[0px] flex-[0_0_100%] pl-[10px] md:flex-[0_0_50%] xl:flex-[auto] xl:pl-[0px]">
        <LatestTransaction variantPause="recent_tx" transaction={tx} />
      </div>
    );
  });

  if (variant === 'side') {
    if (isDesktopWindow)
      return (
        <div className="hidden w-full min-w-[320px] flex-col gap-2 md:gap-4 xl:flex">
          {loadedDataComponent}
          <HeadPause title="Recent transactions" pauseVariant="recent_tx" iconName="transaction" />
          <div className="flex w-full flex-col gap-4">{LatestTransactions}</div>
        </div>
      );
  } else {
    return (
      <>
        {loadedDataComponent}
        {LatestTransactions}
      </>
    );
  }
};

export const RecentTransactionsFallback = ({ variant }: RecentTransactionsProps) => {
  const LatestTransactions = Array(3)
    .fill(null)
    .map((_, idx) => (
      <div
        key={idx}
        className="min-w-[0px] flex-[0_0_100%] pl-[10px] md:flex-[0_0_50%] xl:flex-[auto] xl:pl-[0px] 2xl:flex-none">
        <LatestTransactionFallback />
      </div>
    ));

  if (variant === 'side') {
    return (
      <div className="relative hidden w-full flex-col gap-2 md:gap-4 xl:flex">
        <div className="flex items-center gap-2">
          <Skeleton isLoading className="h-5 w-5" />
          <Skeleton isLoading className="h-5 w-24" />
        </div>

        <div className="flex w-full flex-col gap-[10px]">{LatestTransactions}</div>
      </div>
    );
  } else {
    return LatestTransactions;
  }
};
