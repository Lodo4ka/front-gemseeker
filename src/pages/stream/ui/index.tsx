import { DonatePanel } from 'features/stream';
import { TokenPanel } from 'features/token';
import { StreamBlock } from 'widgets/stream';
import { Donations, DonationsFallback } from './donations';
import { Skeleton } from 'shared/ui/skeleton';
import { useUnit } from 'effector-react';
import { $streamInfo } from 'entities/stream';
import { StreamTheEnd } from './end';

export const StreamPage = () => {
  const streamInfo = useUnit($streamInfo);

  if (streamInfo?.finished) return <StreamTheEnd />;

  return (
    <div className="mx-auto my-0 flex w-full max-w-[1440px] flex-col gap-6">
      <StreamBlock
        type="donation"
        className={{
          tasks: '!mt-0 overflow-x-scroll !px-4 !pb-4 max-lg:!px-0 max-lg:!pt-0 max-lg:!pb-6',
          tasksInside: 'max-lg:hidden',
        }}
      />
      <div className="flex w-full gap-[10px] max-lg:flex-col-reverse max-lg:gap-10">
        <Donations />
        <div className="mt-10 w-full max-w-[437px] max-lg:max-w-full">
          <DonatePanel />
          <TokenPanel />
        </div>
      </div>
    </div>
  );
};

export const StreamPageFallback = () => {
  return (
    <div className="mx-auto my-0 flex w-full max-w-[1440px] flex-col gap-6">
      <div className="flex w-full flex-col gap-4">
        <div className="bg-darkGray-1 h-full w-full rounded-xl pt-4">
          <div className="flex h-full w-full items-center justify-between px-4">
            <Skeleton isLoading className="h-8 w-40 rounded" />
            <Skeleton isLoading className="h-8 w-32 rounded" />
          </div>
          <div className="mt-3 flex w-full flex-col gap-6 p-4">
            <div className="grid h-full w-full gap-[10px] max-lg:flex-col lg:grid-cols-[1fr_320px] lg:px-4 lg:pb-4 xl:grid-cols-[1fr_420px]">
              <Skeleton isLoading className="!bg-darkGray-3 aspect-video w-full rounded-xl" />
              <Skeleton isLoading className="!bg-darkGray-3 h-full min-h-[360px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full gap-[10px] max-lg:flex-col-reverse max-lg:gap-10">
        <DonationsFallback />
        <div className="mt-10 w-full max-w-[437px] max-lg:max-w-full">
          <div className="bg-darkGray-1 relative flex flex-col gap-6 overflow-hidden rounded-xl p-4">
            <div className="relative flex flex-col items-center gap-3">
              <Skeleton isLoading className="mb-3 h-12 w-12 rounded-full" />
              <Skeleton isLoading className="mb-2 h-6 w-2/3 rounded" />
              <Skeleton isLoading className="mb-4 h-4 w-1/2 rounded" />
            </div>
            <Skeleton isLoading className="h-10 w-full rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};
