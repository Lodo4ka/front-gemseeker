import { motion } from 'framer-motion';
import { AvatarFallback } from '../avatar';
import { Skeleton } from 'shared/ui/skeleton';
import { StatsFallback } from '../stats';

export const TokenMarketFallback = () => {
  return (
    <motion.div className="bg-darkGray-1 flex items-start rounded-xl p-2 md:gap-4 md:p-4">
      <div className="hidden h-full min-h-[129px] flex-col items-center justify-between md:flex">
        <AvatarFallback
          className={{
            image: 'h-[76px] w-[76px] min-w-[76px]',
            container: 'hidden gap-2 md:flex',
            text: 'h-[18px] !w-10',
          }}
        />

        <Skeleton isLoading className="h-4 w-13" />
      </div>
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full items-center gap-2 md:gap-0">
          <AvatarFallback
            className={{
              image: 'h-11 w-11 min-w-11',
              text: 'h-[18px] w-7',
              container: 'gap-2 md:hidden',
            }}
          />
          <div className="flex w-full flex-col gap-[6px]">
            <div className="flex w-full items-center justify-between">
              <div className="xs:gap-2 flex items-center gap-[6px]">
                <Skeleton isLoading className="h-5 w-15" />
                <Skeleton isLoading className="h-5 w-20" />
                <Skeleton isLoading className="h-5 w-6" />
              </div>
              <Skeleton isLoading className="h-8 w-12 rounded-[6px]" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton isLoading className="h-4 w-[104px]" />
              <div className="flex items-center gap-2">
                <Skeleton isLoading className="h-6 w-6 rounded-full" />
                <Skeleton isLoading className="h-6 w-6 rounded-full" />
                <Skeleton isLoading className="h-6 w-6 rounded-full" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton isLoading className="h-5 w-12" />
              <Skeleton isLoading className="h-5 w-12" />
              <Skeleton isLoading className="h-5 w-12" />
              <Skeleton isLoading className="h-5 w-12" />
            </div>
          </div>
        </div>
        <Skeleton isLoading className="h-[0.5px] w-full" />
        <div className="flex w-full items-center justify-between">
          <StatsFallback />
          <Skeleton isLoading className="h-5 w-24" />
        </div>
      </div>
    </motion.div>
  );
};
