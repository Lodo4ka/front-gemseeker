import { Skeleton } from 'shared/ui/skeleton';
import { Typography } from 'shared/ui/typography';

export const CreateTokenSkeleton = () => {
  return (
    <div className="flex w-full flex-col justify-between">
      <div className="flex flex-col p-5 max-sm:p-0">
        <div className="flex items-center gap-[30px] max-sm:flex-col max-sm:gap-[15px]">
          {/* Image upload skeleton */}
          <Skeleton className="min-h-[200px] min-w-[200px] rounded-lg" isLoading={true} />

          <div className="flex w-full flex-col gap-4">
            {/* Token name and ticker inputs */}
            <Skeleton className="h-[60px] w-full rounded-lg" isLoading={true} />
            <Skeleton className="h-[60px] w-full rounded-lg" isLoading={true} />
          </div>
        </div>

        {/* Description input */}
        <Skeleton className="mt-4 h-[60px] w-full rounded-lg pb-6" isLoading={true} />

        <Typography className="mt-6 mb-4" size="headline3" weight="medium">
          Token
        </Typography>

        {/* Input buy section */}
        <Skeleton className="h-[120px] w-full rounded-lg" isLoading={true} />

        <Typography className="mt-6 mb-4" size="headline3" weight="medium">
          Video preview
        </Typography>

        {/* Video preview input */}
        <Skeleton className="h-[60px] w-full rounded-lg" isLoading={true} />

        <Typography className="mt-6 mb-4" size="headline3" weight="medium">
          Socials
        </Typography>

        {/* Social inputs */}
        <div className="border-b-separator grid w-full grid-cols-1 gap-3 border-b-[0.5px] pb-6">
          <Skeleton className="h-[60px] w-full rounded-lg" isLoading={true} />
          <Skeleton className="h-[60px] w-full rounded-lg" isLoading={true} />
          <Skeleton className="h-[60px] w-full rounded-lg" isLoading={true} />
        </div>

        <Typography className="mt-6 mb-4" size="headline2" weight="medium">
          Live-stream and other
        </Typography>

        <div className="flex w-full flex-col gap-4">
          {/* NSFW toggle */}
          <Skeleton className="h-[50px] w-full rounded-lg" isLoading={true} />
          {/* Live stream section */}
          <Skeleton className="h-[100px] w-full rounded-lg" isLoading={true} />
        </div>
      </div>

      {/* Footer with button */}
      <div className="border-t-separator flex w-full items-center justify-end gap-4 border-t-[0.5px] p-5 max-sm:mt-5">
        <Skeleton className="h-[40px] w-[200px] rounded-lg" isLoading={true} />
        <Skeleton className="h-[40px] w-[120px] rounded-lg" isLoading={true} />
      </div>
    </div>
  );
};
