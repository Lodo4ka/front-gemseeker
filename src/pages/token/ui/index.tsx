import { SwapForm, SwapFormFallback } from 'features/token';
import { TokenHeader } from 'widgets/token-header';
import { TokenInfo, TokenInfoFallback } from './components';
import { TokenSmall, Details, Chart, ChartFallback, $address } from 'entities/token';
import { Skeleton } from 'shared/ui/skeleton';
import { Volume, VolumeFallback } from './volume';
import { StreamPanel } from 'features/stream/create';
import { StreamAccordion } from 'widgets/stream';
import { MenuMobile } from './menu-mobile';
import { useUnit } from 'effector-react';
import { $isNotFoundToken } from 'entities/token';
import { NotFoundTemplate } from 'widgets/not-found';

export const TokenPage = () => {
  const isNotFoundToken = useUnit($isNotFoundToken);
  
  if(isNotFoundToken && isNotFoundToken !== null) {
    return <NotFoundTemplate />
  }

  return (
    <div className="mx-auto my-0 flex h-full w-full max-w-[1440px] flex-col gap-3">
      <TokenHeader />
      <StreamAccordion className="w-full" />
      <MenuMobile />
      <div className="2lg:flex hidden w-full gap-[10px]">
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <Chart />
          <TokenInfo />
        </div>
        <div className="flex min-w-[437px] max-w-[437px] flex-col gap-4 shrink-0">
          <StreamPanel $address={$address} />
          <SwapForm />
          <Volume />
          <TokenSmall />
          <Details />
        </div>
      </div>
    </div>
  );
};

export const TokenPageFallback = () => {
  return (
    <div className="mx-auto my-0 flex w-full max-w-[1440px] flex-col gap-3">
      <TokenHeader isFallback />
      <div className="2lg:hidden flex flex-col gap-3">
        <div className="border-t-separator bg-bg fixed -bottom-[0px] left-0 z-10 flex w-full justify-between overflow-visible rounded-none border-t-[0.5px] border-r-0 border-b-0 border-l-0 px-4 pt-2 pb-1">
          <div className="flex w-full flex-col items-center justify-center gap-2 pb-2">
            <Skeleton isLoading className="h-5 w-5 rounded-full" />
            <Skeleton isLoading className="h-4 w-11 rounded" />
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-2 pb-2">
            <Skeleton isLoading className="h-5 w-5 rounded-full" />
            <Skeleton isLoading className="h-4 w-10 rounded" />
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-2 pb-2">
            <Skeleton isLoading className="h-5 w-5 rounded-full" />
            <Skeleton isLoading className="h-4 w-7 rounded" />
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-2 pb-2">
            <Skeleton isLoading className="h-5 w-5 rounded-full" />
            <Skeleton isLoading className="h-4 w-13 rounded" />
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-2 pb-2">
            <Skeleton isLoading className="h-5 w-5 rounded-full" />
            <Skeleton isLoading className="h-4 w-9 rounded" />
          </div>
        </div>
      </div>
      <div className="2lg:flex hidden w-full gap-[10px]">
        <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
          <ChartFallback />
          <TokenInfoFallback />
        </div>
        <div className="flex w-full max-w-[437px] min-w-[437px] flex-col gap-4">
          <SwapFormFallback />
          <VolumeFallback />
          <TokenSmall isFallback />
          <Details isFallback />
        </div>
      </div>
    </div>
  );
};
