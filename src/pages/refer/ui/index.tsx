import { Typography } from 'shared/ui/typography';

import { ReferralStatistics } from 'widgets/referral-statistics';
import { RefRewardsHistory } from 'widgets/ref-reward-history';
import { ShareRefer } from 'features/share-refer';
import { ClaimRefer } from 'features/claim-ref';

export const ReferPage = () => {
  return (
    <div className="max-2lg:items-start flex h-full w-full items-center justify-center">
      <div className="border-primary/30 max-2lg:border-none relative w-full max-w-[896px] rounded-[26px] border-[0.5px]">
        <div className="max-2lg:border-none max-2lg:before:hidden max-2lg:after:hidden relative z-[1] w-full rounded-[26px] border-[10px] border-[rgba(255,255,255,0.1)]">
          <div className="bg-darkGray-1 max-2lg:p-0 max-2lg:before:hidden max-2lg:after:hidden max-2lg:bg-transparent relative w-full rounded-2xl p-5 before:absolute before:top-[5px] before:left-[5px] before:-z-20 before:h-[150px] before:w-[200px] before:bg-transparent before:shadow-[-80px_-80px_150px_#34D399] before:content-[''] after:absolute after:right-[5px] after:bottom-[5px] after:-z-20 after:h-[150px] after:w-[200px] after:shadow-[110px_110px_150px_#FBBF24] after:content-[''] md:h-[583px]">
            <Typography icon={{ position: 'left', size: 20, name: 'refer' }} className="!gap-[6px]" size="headline4">
              Invite friends
            </Typography>
            <Typography weight="regular" color="secondary" className="mt-2 mb-5" size="subheadline2">
              Boost your earnings and savings with Aevo's referral program! Refer traders and earn 10% of their trading
              fees.
            </Typography>

            <ReferralStatistics />

            <div className="border-y-separator mt-4 mb-5 flex w-full items-center gap-4 border-y-[0.5px] py-4 max-md:flex-col">
              <ShareRefer />
              <ClaimRefer />
            </div>
            <div className="flex w-full flex-col gap-3 h-full overflow-y-auto">
              <Typography
                size="headline4"
                color="secondary"
                className="!gap-[6px]"
                weight="regular"
                icon={{ position: 'left', name: 'history', size: 20 }}>
                Rewards history
              </Typography>

              <RefRewardsHistory />
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
