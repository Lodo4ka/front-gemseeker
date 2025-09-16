import { useUnit } from 'effector-react';
import { $tokenVolume } from 'entities/token';
import { formatter } from 'shared/lib/formatter';
import { Skeleton } from 'shared/ui/skeleton';
import { Typography } from 'shared/ui/typography';
import { Percent } from '../percent';
import { $rate } from 'features/exchange-rate';

type VolumeContentProps = {
  index?: number;
  isFallback?: boolean;
};

export const VolumeContent = ({ index = 0, isFallback = false }: VolumeContentProps) => {
  const [volume, rate] = useUnit([$tokenVolume, $rate]);

  const currentVolume = volume?.[index];
  if (!volume || !currentVolume || isFallback) return <VolumeContentFallback />;
  return (
    <div className="bg-darkGray-1 flex w-full justify-between gap-3 rounded-xl p-4">
      <div className="flex w-full max-w-[82px] flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Typography size="captain1" color="secondary">
            TXNS
          </Typography>
          <Typography size="subheadline1">{formatter.number.uiDefault(currentVolume.txns)}</Typography>
        </div>
        <div className="flex flex-col gap-1">
          <Typography size="captain1" color="secondary">
            Volume
          </Typography>
          <Typography size="subheadline1">${formatter.number.uiDefault(currentVolume.volume * rate)}</Typography>
        </div>
        <div className="flex flex-col gap-1">
          <Typography size="captain1" color="secondary">
            Makers
          </Typography>
          <Typography size="subheadline1">{formatter.number.uiDefault(currentVolume.makers)}</Typography>
        </div>
      </div>
      <div className="border-l-separator flex w-full flex-col gap-[15px] border-l-[0.5px] pl-3">
        <div className="flex w-full flex-col gap-1">
          <div className="flex w-full items-center justify-between">
            <Typography size="captain1" color="secondary">
              Buys
            </Typography>
            <Typography size="captain1" color="secondary">
              Sells
            </Typography>
          </div>
          <div className="flex w-full items-center justify-between">
            <Typography size="subheadline1">{formatter.number.uiDefault(currentVolume.buys)}</Typography>
            <Typography size="subheadline1">{formatter.number.uiDefault(currentVolume.sells)}</Typography>
          </div>
          <Percent v1={currentVolume.buys} v2={currentVolume.sells} />
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="flex w-full items-center justify-between">
            <Typography size="captain1" color="secondary">
              Buy Vol
            </Typography>
            <Typography size="captain1" color="secondary">
              Sell Vol
            </Typography>
          </div>
          <div className="flex w-full items-center justify-between">
            <Typography size="subheadline1">${formatter.number.uiDefault(currentVolume.buy_volume * rate)}</Typography>
            <Typography size="subheadline1">${formatter.number.uiDefault(currentVolume.sell_volume * rate)}</Typography>
          </div>
          <Percent v1={currentVolume.buy_volume} v2={currentVolume.sell_volume} />
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="flex w-full items-center justify-between">
            <Typography size="captain1" color="secondary">
              Buyers
            </Typography>
            <Typography size="captain1" color="secondary">
              Sellers
            </Typography>
          </div>
          <div className="flex w-full items-center justify-between">
            <Typography size="subheadline1">{formatter.number.uiDefault(currentVolume.buyers)}</Typography>
            <Typography size="subheadline1">{formatter.number.uiDefault(currentVolume.sellers)}</Typography>
          </div>
          <Percent v1={currentVolume.buyers} v2={currentVolume.sellers} />
        </div>
      </div>
    </div>
  );
};

const VolumeContentFallback = () => (
  <div className="bg-darkGray-1 flex w-full justify-between gap-3 rounded-xl p-4">
    <div className="flex w-full max-w-[82px] flex-col gap-6">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col gap-1">
          <Skeleton isLoading className="h-4 w-10 rounded" />
          <Skeleton isLoading className="h-5 w-16 rounded" />
        </div>
      ))}
    </div>
    <div className="flex w-full flex-col gap-[15px] pl-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex w-full flex-col gap-1">
          <div className="flex w-full items-center justify-between">
            <Skeleton isLoading className="h-4 w-12 rounded" />
            <Skeleton isLoading className="h-4 w-12 rounded" />
          </div>
          <div className="flex w-full items-center justify-between">
            <Skeleton isLoading className="h-5 w-20 rounded" />
            <Skeleton isLoading className="h-5 w-20 rounded" />
          </div>
          <div className="flex w-full items-center gap-[5px]">
            <Skeleton isLoading className="h-[3px] w-full rounded-[2px]" />
            <Skeleton isLoading className="h-[3px] w-full rounded-[2px]" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
