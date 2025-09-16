import { useUnit } from 'effector-react';
import { Link } from 'atomic-router-react';

import { Button } from 'shared/ui/button';
import { Icon } from 'shared/ui/icon';
import { Typography } from 'shared/ui/typography';
import { $mcapUsd, $rocket, $rocketStatus, copied, rocketLoaded } from '../model';
import {
  Stats,
  Avatar,
  AvatarFallback,
  StatsFallback,
  TokenMarketInfoPercentsProps,
  $tokensDopInfo,
  Progress,
} from 'entities/token';
import { CopyAddress } from 'features/copy-address';
import { Skeleton } from 'shared/ui/skeleton';
import { QuickBuyButton } from 'features/quick-buy';
import { LoadedData } from 'shared/ui/loaded-data';
import { Image } from 'shared/ui/image';
import { RocketResponse } from 'shared/api/queries/token/rocket';
import { formatter } from 'shared/lib/formatter';
import { AnimationWrapper } from 'shared/ui/update-wrapper';
import { routes } from 'shared/config/router';
import { HeadPause } from 'shared/ui/head-pause';
import { pinataUrl } from 'shared/lib/base-url';
import { useEffect, useMemo, useRef, useState } from 'react';

interface TokenRocketProps {
  isFallback?: boolean;
}

export const TokenRocket = ({ isFallback }: TokenRocketProps) => {
  const [rocket, rocketStatus, mcapUsd] = useUnit([$rocket, $rocketStatus, $mcapUsd]);
  const isLoading = isFallback || rocketStatus || rocket === null;

  return (
    <div className="relative flex w-full flex-col gap-2 md:gap-4">
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Skeleton isLoading className="h-5 w-5" />
          <Skeleton isLoading className="h-5 w-24" />
        </div>
      ) : (
        <HeadPause title="Top gem" pauseVariant="rocket" iconName="rocket" />
      )}

      {/* Always render LoadedData for refresh functionality, but only trigger when not in fallback mode */}
      <LoadedData
        isFullSize
        loadedData={rocketLoaded}
        params={{ isFallback }} // Pass fallback state to control when to actually trigger
      />

      {!isLoading ? <Rocket rocket={rocket} mcapUsd={mcapUsd} /> : <TokenRocketFallback />}
    </div>
  );
};

interface RocketProps extends TokenMarketInfoPercentsProps {
  rocket: RocketResponse;
  mcapUsd: number;
}

const Rocket = ({ rocket, mcapUsd }: RocketProps) => {
  const dopInfo = useUnit($tokensDopInfo);
  const currentDopInfo = useMemo(() => dopInfo?.[rocket.address], [dopInfo, rocket.address]);

  const prevRocketRef = useRef<RocketResponse | null>(null);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (!prevRocketRef.current) {
      prevRocketRef.current = rocket;
      return;
    }

    const isChanged = ['price', 'mcap', 'messages', 'holders', 'alltime_buy_txes', 'alltime_sell_txes'].some(
      (key) => prevRocketRef.current?.[key as keyof RocketResponse] !== rocket?.[key as keyof RocketResponse],
    );

    if (isChanged) {
      setIsUpdated(true);
      const timer = setTimeout(() => setIsUpdated(false), 800);
      return () => clearTimeout(timer);
    }

    prevRocketRef.current = rocket;
  }, [rocket]);

  return (
    <AnimationWrapper
      isUpdated={isUpdated}
      className="from-darkGray-1 to-green/10 relative z-[3] flex items-center gap-4 rounded-xl bg-radial-[at_15%_15%] to-100% p-2 md:p-4"
      pauseVariant="rocket">
      <Link to={routes.token} params={{ address: rocket.address }} className="absolute inset-0 z-0 h-full w-full" />
      <Image
        preview={pinataUrl(rocket?.photo_hash ?? '')}
        className="bg-primary hidden h-[198px] w-full max-w-[200px] min-w-[140px] rounded-xl md:block"
      />

      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full items-center gap-2 md:gap-0">
          <Avatar
            url={pinataUrl(rocket?.photo_hash) ?? ''}
            progress={rocket.bounding_curve}
            play={false}
            className={{
              container: 'h-12 w-12 min-w-12 md:hidden',
              image: 'h-9 w-9 min-w-9',
              stroke: 'stroke-8',
              text: 'md:hidden',
            }}
          />
          <div className="flex w-full flex-col gap-[6px]">
            <div className="flex w-full items-center justify-between gap-[4px]">
              <div className="flex items-center gap-[6px]">
                <Typography
                  size="subheadline2"
                  className="!gap-2 max-md:!text-[12px]"
                  color="secondary"
                  icon={{ size: 4, position: 'right', name: 'dot' }}
                  weight="regular">
                  {rocket?.name}
                </Typography>

                <Typography
                  size="subheadline2"
                  color="secondary"
                  className="!gap-1"
                  icon={{
                    position: 'left',
                    size: 16,
                    name: 'comment',
                  }}>
                  {formatter.number.uiDefault(rocket?.messages)}
                </Typography>
              </div>
              <div className="flex items-center gap-4">
                {/* <Typography size="subheadline2" className="hidden text-nowrap md:flex" color="green">
                  MC: ${formatter.number.uiDefault(mcapUsd)}
                </Typography> */}
                <QuickBuyButton token={rocket} className="relative z-1" />
              </div>
            </div>
            <div className="flex items-center gap-2 max-md:!mb-1 md:-mt-[6px]">
              <Typography size="subheadline2" className="max-md:!text-[12px]" weight="regular">
                {rocket?.symbol}
              </Typography>
              <Typography size="subheadline2" className="text-nowrap" color="green">
                MC: ${formatter.number.uiDefault(mcapUsd)}
              </Typography>
              <Progress
                prev_ath={rocket.prev_ath}
                current={rocket.mcap}
                lastTxTimestamp={rocket.last_tx_timestamp}
                ath={rocket.ath}
              />
            </div>

            <div className="flex items-center gap-2">
              <CopyAddress
                address={rocket?.address ?? ''}
                copied={copied}
                className={{ text: 'relative z-1 !gap-1' }}
              />

              {(rocket?.twitter || rocket?.website || rocket?.telegram) && (
                <Icon name="dot" className="text-secondary" size={4} />
              )}

              <div className="relative z-1 flex items-center gap-[6px]">
                {rocket?.twitter && (
                  <Button
                    as={Link}
                    target="_blank"
                    to={rocket.twitter}
                    theme="quaternary"
                    className={{ button: 'h-6 w-6 !rounded-full !p-[6px]' }}
                    icon={{ name: 'twitter', size: 12, position: 'left' }}
                  />
                )}

                {rocket?.website && (
                  <Button
                    as={Link}
                    target="_blank"
                    to={rocket.website}
                    theme="quaternary"
                    className={{ button: 'h-6 w-6 !rounded-full !p-[6px]' }}
                    icon={{ name: 'site', size: 12, position: 'left' }}
                  />
                )}

                {rocket?.telegram && (
                  <Button
                    as={Link}
                    target="_blank"
                    to={rocket?.telegram}
                    theme="quaternary"
                    className={{ button: 'h-6 w-6 !rounded-full !p-[6px]' }}
                    icon={{ name: 'telegram', size: 12, position: 'left' }}
                  />
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Typography
                size="captain1"
                className="!gap-1"
                icon={{ name: 'user', position: 'left', size: 16 }}
                color="secondary">
                {typeof currentDopInfo?.topHolders === 'number' &&
                  `${formatter.number.round(currentDopInfo.topHolders, 1)}%`}
                {typeof currentDopInfo?.topHolders != 'number' && <Skeleton isLoading className="h-5 w-6" />}
              </Typography>
              <Typography
                size="captain1"
                className="!gap-1"
                icon={{ name: 'circled', position: 'left', size: 16 }}
                color="secondary">
                {typeof currentDopInfo?.snipers === 'number' && `${formatter.number.round(currentDopInfo.snipers, 1)}%`}
                {typeof currentDopInfo?.snipers != 'number' && <Skeleton isLoading className="h-5 w-6" />}
              </Typography>
              <Typography
                size="captain1"
                className="!gap-1"
                icon={{ name: 'cook', position: 'left', size: 16 }}
                color="secondary">
                {typeof currentDopInfo?.creator === 'number' && `${formatter.number.round(currentDopInfo.creator, 1)}%`}
                {typeof currentDopInfo?.creator != 'number' && <Skeleton isLoading className="h-5 w-6" />}
              </Typography>
              <Typography
                size="captain1"
                className="!gap-1"
                icon={{ name: 'mouse', position: 'left', size: 16 }}
                color="secondary">
                {typeof currentDopInfo?.insiders === 'number' &&
                  `${formatter.number.round(currentDopInfo.insiders, 1)}%`}
                {typeof currentDopInfo?.insiders != 'number' && <Skeleton isLoading className="h-5 w-6" />}
              </Typography>
            </div>
          </div>
        </div>
        <div className="bg-separator h-[0.5px] w-full" />
        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full items-center justify-between">
            <Stats
              creation_date={rocket?.creation_date}
              count_holders={rocket?.holders}
              count_tx={rocket?.alltime_buy_txes + rocket.alltime_sell_txes}
              username={rocket?.created_by.user_nickname}
            />

            {/* <Typography size="subheadline2" className="text-nowrap md:hidden" color="green">
              MC: ${formatter.number.uiDefault(mcapUsd)}
            </Typography> */}
          </div>
          <div className="hidden w-full flex-col gap-[10px] md:flex">
            <div className="flex w-full items-center justify-between">
              <Typography
                size="subheadline2"
                color={rocket.bounding_curve * 100 === 100 ? 'yellow' : 'green'}
                weight="regular">
                Progress: {(rocket.bounding_curve * 100).toFixed(2)} %
              </Typography>
              <Typography color="secondary" size="subheadline2" weight="regular">
                {formatter.number.uiDefault(rocket.real_sol / Math.pow(10, 9))}/
                {/* {formatter.number.uiDefault(+__MAX_MCAP__)} SOL */}
                {formatter.number.uiDefault(1)} SOL
              </Typography>
            </div>
            <div className="bg-darkGray-3 h-[15px] w-full rounded-[2px]">
              <div
                style={{
                  width: `${rocket.bounding_curve * 100}%`,
                  background: `var(--color-${rocket.bounding_curve * 100 === 100 ? 'yellow' : 'green'})`,
                }}
                className="h-full rounded-[2px]"
              />
            </div>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
};

export const TokenRocketFallback = () => {
  return (
    <div className="from-darkGray-1 to-green/10 flex items-center gap-4 rounded-xl bg-radial-[at_15%_15%] to-100% p-2 md:p-4">
      <Skeleton isLoading className="hidden h-[198px] w-full max-w-[200px] min-w-[140px] rounded-xl md:block" />
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full items-center gap-2 md:gap-0">
          <AvatarFallback
            className={{
              image: 'h-9 w-9 min-w-9 md:hidden',
              text: 'md:hidden',
            }}
          />
          <div className="flex w-full flex-col gap-[6px]">
            <div className="flex w-full items-center justify-between">
              <div className="xs:gap-[2px] flex items-center gap-[6px]">
                <Skeleton isLoading className="xs:w-20 h-5 w-15 sm:w-24" />
                <Skeleton isLoading className="xs:w-15 h-5 w-10 sm:w-20" />
                <Skeleton isLoading className="xs:w-4 h-5 w-3 sm:w-6" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton isLoading className="hidden h-5 w-24 md:block" />
                <Skeleton isLoading className="h-8 w-12 rounded-[6px] sm:w-16" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton isLoading className="h-6 w-[130px] sm:w-[280px]" />
              <div className="flex items-center gap-[6px]">
                <Skeleton isLoading className="h-6 w-6 rounded-full" />
                <Skeleton isLoading className="h-6 w-6 rounded-full" />
                <Skeleton isLoading className="h-6 w-6 rounded-full" />
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Skeleton isLoading className="h-5 w-12" />
              <Skeleton isLoading className="h-5 w-12" />
              <Skeleton isLoading className="h-5 w-12" />
              <Skeleton isLoading className="h-5 w-12" />
            </div>
          </div>
        </div>
        <Skeleton isLoading className="h-[0.5px] w-full" />
        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full items-center justify-between">
            <StatsFallback />
            <Skeleton isLoading className="h-5 w-20 sm:w-24 md:hidden" />
          </div>
          <div className="hidden w-full flex-col gap-[10px] md:flex">
            <div className="flex w-full items-center justify-between">
              <Skeleton isLoading className="h-5 w-48" />
              <Skeleton isLoading className="h-5 w-32" />
            </div>
            <Skeleton isLoading className="h-[15px] w-full rounded-[2px]" />
          </div>
        </div>
      </div>
    </div>
  );
};
