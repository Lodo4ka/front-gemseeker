import { useUnit } from 'effector-react';
import { $rate } from 'features/exchange-rate';
import { api } from 'shared/api';
import { formatter } from 'shared/lib/formatter';
import { Typography } from 'shared/ui/typography';
import { infer as types } from 'zod';
import { Skeleton } from 'shared/ui/skeleton';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { modalsStore } from 'shared/lib/modal';
import { AuditsModalProps } from './audits-modal';
import { AuditsCount } from './audits-count';
import { Progress } from 'entities/token';

export type StatsProps = {
  token: types<typeof api.contracts.token.single>;
};
export const Stats = ({ token }: StatsProps) => {
  const rate = useUnit($rate);
  const openModal = useUnit(modalsStore.openModal);
  return (
    <div className="scrollbar-hide flex items-center gap-x-8 gap-y-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] max-lg:w-full max-lg:justify-between [&::-webkit-scrollbar]:hidden">
      <div className="flex flex-col gap-1">
        <Typography size="subheadline1" weight="regular" color="secondary">
          Price
        </Typography>

        <Typography size="subheadline1">${formatter.number.formatSmallNumber(token.rate * rate)}</Typography>
      </div>

      <div className="flex flex-col gap-1">
        <Typography size="subheadline1" weight="regular" color="secondary">
          B.Curve
        </Typography>
        <Typography size="subheadline1">
          {formatter.number.formatSmallNumber(+token.bounding_curve.toFixed(2))}%
        </Typography>
      </div>

      <div className="flex flex-col gap-1">
        <Typography size="subheadline1" weight="regular" color="secondary">
          Liquidity
        </Typography>
        <Typography className="!gap-2" icon={{ position: 'right', name: 'lock2', size: 16 }} size="subheadline1">
          ${formatter.number.formatSmallNumber(((token.virtual_sol * 2) / LAMPORTS_PER_SOL) * rate)}
        </Typography>
      </div>

      <div className="relative flex cursor-pointer flex-col gap-1" onClick={() => openModal(AuditsModalProps)}>
        <Typography size="subheadline1" weight="regular" color="secondary">
          Audits
        </Typography>
        <AuditsCount />
      </div>

      <div className="flex items-center gap-2 max-lg:hidden">
        <Typography size="subheadline1">MC: ${formatter.number.formatSmallNumber(token.mcap * rate)}</Typography>
        <Progress
          prev_ath={token.prev_ath}
          ath={token.ath}
          current={token.mcap}
          lastTxTimestamp={token.last_tx_timestamp}
        />
      </div>
    </div>
  );
};

export const StatsSkeleton = () => (
  <div className="flex items-center gap-8 max-[660px]:!gap-4 max-lg:w-full max-lg:justify-between">
    {Array.from({ length: 4 }).map((_, idx) => (
      <div key={idx} className="flex flex-col gap-1">
        <Skeleton isLoading className="h-5 w-12 rounded max-[660px]:!w-12 max-lg:w-20" />
        <Skeleton isLoading className="h-5 w-16 rounded max-[660px]:!w-16 max-lg:w-25" />
      </div>
    ))}
  </div>
);
