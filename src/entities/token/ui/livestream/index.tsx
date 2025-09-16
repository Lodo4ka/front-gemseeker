import { Button } from 'shared/ui/button';
import { Icon } from 'shared/ui/icon';
import { Typography } from 'shared/ui/typography';
import clsx from 'clsx';
import { CopyAddress } from 'features/copy-address';
import { QuickBuyButton } from 'features/quick-buy';
import { Stats, StatsFallback } from 'entities/token';
import { Skeleton } from 'shared/ui/skeleton';
import { ImageHover } from 'shared/ui/image';
import { formatter } from 'shared/lib/formatter';
import { Link } from 'atomic-router-react';
import { routes } from 'shared/config/router';

import { useEffect, useMemo, useState, useRef } from 'react';

import { type Token, type StreamListItem, MiniPlayer } from 'entities/stream';
import { copied } from '../../model';
import { $tokensDopInfo, loadedToken } from '../../model/dop-info';
import { useHover } from 'shared/lib/use-hover';
import { useUnit } from 'effector-react';
import { getFullUrlImg } from 'shared/lib/full-url-img';
import { LoadedData } from 'shared/ui/loaded-data';
import { $rate } from 'features/exchange-rate';
import { AnimationWrapper } from 'shared/ui/update-wrapper';
import { Progress } from '../components/progress';

const radius = 70;
const circumference = 2 * Math.PI * radius;

const isMobileDevice = () => {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  );
};

export type LivestreamTokenProps = {
  stream: StreamListItem;
};

export const LivestreamToken = ({ stream }: LivestreamTokenProps) => {
  const token = stream.stream_tokens[0] as Token;
  const [dopInfo, rate] = useUnit([$tokensDopInfo, $rate]);
  const currentDopInfo = dopInfo?.[token.address];
  const offset = circumference - (token.bounding_curve / 100) * circumference;
  const { isHovered, handleMouseOver, handleMouseOut } = useHover({ pauseVariant: 'streams' });

  const [isUpdated, setIsUpdated] = useState(false);
  const prevStreamRef = useRef<StreamListItem | null>(null);
  const prevTokenRef = useRef<Token | null>(null);
  useEffect(() => {
    if (!prevStreamRef.current) {
      prevStreamRef.current = stream;
      prevTokenRef.current = token;
      return;
    }

    const isChangedStream = ['donation_sum'].some(
      (key) => prevStreamRef.current?.[key as keyof StreamListItem] !== stream[key as keyof StreamListItem],
    );
    const isChangedToken = ['messages', 'holders', 'alltime_sell_txes', 'alltime_buy_txes'].some(
      (key) => prevTokenRef.current?.[key as keyof Token] !== token?.[key as keyof Token],
    );

    if (isChangedToken || isChangedStream) {
      setIsUpdated(true);
      const timer = setTimeout(() => setIsUpdated(false), 800);
      prevStreamRef.current = stream;
      prevTokenRef.current = token;
      return () => clearTimeout(timer);
    }
  }, [stream, token]);

  return (
    <AnimationWrapper
      handleMouseOverProps={handleMouseOver}
      handleMouseOutProps={handleMouseOut}
      isUpdated={isUpdated}
      pauseVariant="streams"
      className={clsx(
        'relative flex w-full cursor-pointer flex-col gap-[5px] rounded-xl p-2 sm:gap-[10px] sm:p-4',
        'hover:z-10 hover:bg-gradient-to-br hover:from-red-900 hover:to-red-800 hover:shadow-2xl',
      )}
      style={{ background: `var(--color-red-gradient-dark)` }}>
      <Link to={routes.token} params={{ address: token.address }} className="absolute inset-0 z-1 h-full w-full" />
      <MiniPlayer isHovered={isHovered} stream={stream} />
      <LoadedData
        loadedData={loadedToken}
        isOnce
        params={{ address: token?.address, creator: token?.deployer_wallet }}
        isFullSize
      />
      <div className="flex w-full flex-col gap-2 sm:gap-4">
        <div className="flex flex-col gap-[6px] sm:gap-[10px]">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              <ImageHover
                preview={getFullUrlImg(token.photo_hash, token.name)}
                className="h-7 w-7 rounded-full"
                alt={token.name}
              />

              <Typography
                className="!gap-1 !text-[10px] sm:!gap-2 sm:!text-[14px]"
                color="secondary"
                size="subheadline2"
                icon={{ name: 'dot', size: 4, position: 'right' }}>
                {token.symbol}
              </Typography>
              <Typography
                size="subheadline2"
                color="secondary"
                className="!gap-[2px] !text-[12px] sm:!gap-1 sm:!text-[14px]"
                icon={{
                  position: 'left',
                  size: 16,
                  name: 'comment',
                }}>
                {formatter.number.uiDefault(token.messages)}
              </Typography>

              {token.is_nsfw && (
                <>
                  <Icon name="dot" className="text-secondary" size={4} />
                  <Typography size="subheadline2" className={'text-nsfw'}>
                    NSFW
                  </Typography>
                </>
              )}
            </div>
            <div className="relative z-3 flex flex-col items-center gap-2">
              <QuickBuyButton token={token} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Typography
              className="!gap-2 !text-[12px] sm:!text-[14px]"
              icon={{ position: 'right', name: 'dot', size: 4 }}
              size="subheadline2"
              weight="regular">
              {token.name}
            </Typography>
            <Progress
              prev_ath={token.prev_ath}
              current={token.mcap}
              ath={token.ath}
              lastTxTimestamp={token.last_tx_timestamp}
            />
          </div>
          <div className="flex items-center gap-2">
            <CopyAddress
              address={token.address}
              copied={copied}
              className={{ container: 'relative z-3', text: '!gap-1 !text-[12px] sm:!text-[14px]' }}
            />

            {(token.twitter || token.website || token.telegram || token.youtube) && (
              <Icon name="dot" className="text-secondary" size={4} />
            )}
            <div className="relative z-3 flex items-center gap-[6px]">
              {token.twitter && (
                <Button
                  as={Link}
                  to={token.twitter}
                  target="_blank"
                  theme="quaternary"
                  className={{ button: 'h-6 w-6 !rounded-full !p-[6px]' }}
                  icon={{ name: 'twitter', size: 12, position: 'left' }}
                />
              )}

              {token.website && (
                <Button
                  as={Link}
                  to={token.website}
                  target="_blank"
                  theme="quaternary"
                  className={{ button: 'h-6 w-6 !rounded-full !p-[6px]' }}
                  icon={{ name: 'site', size: 12, position: 'left' }}
                />
              )}

              {token.telegram && (
                <Button
                  as={Link}
                  to={token.telegram}
                  target="_blank"
                  theme="quaternary"
                  className={{ button: 'h-6 w-6 !rounded-full !p-[6px]' }}
                  icon={{ name: 'telegram', size: 12, position: 'left' }}
                />
              )}

              {token.youtube && (
                <Button
                  as={Link}
                  to={token.youtube}
                  target="_blank"
                  theme="quaternary"
                  className={{ button: 'h-6 w-6 !rounded-full !p-[6px]' }}
                  icon={{ name: 'youtube', size: 12, position: 'left' }}
                />
              )}
            </div>
          </div>

          <div className="relative flex items-center justify-between gap-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <Typography
                size="captain1"
                className="!gap-1"
                icon={{ name: 'user', position: 'left', size: 16 }}
                color="secondary">
                {typeof currentDopInfo?.topHolders === 'number' ? (
                  `${formatter.number.round(currentDopInfo.topHolders, 1)}%`
                ) : (
                  <Skeleton isLoading className="h-5 w-6" />
                )}
              </Typography>
              <Typography
                size="captain1"
                className="!gap-1"
                icon={{ name: 'circled', position: 'left', size: 16 }}
                color="secondary">
                {typeof currentDopInfo?.snipers === 'number' ? (
                  `${formatter.number.round(currentDopInfo?.snipers, 1)}%`
                ) : (
                  <Skeleton isLoading className="h-5 w-6" />
                )}
              </Typography>
              <Typography
                size="captain1"
                className="!gap-1"
                icon={{ name: 'cook', position: 'left', size: 16 }}
                color="secondary">
                {typeof currentDopInfo?.creator === 'number' ? (
                  `${formatter.number.round(currentDopInfo?.creator, 1)}%`
                ) : (
                  <Skeleton isLoading className="h-5 w-6" />
                )}
              </Typography>
              <Typography
                size="captain1"
                className="!gap-1"
                icon={{ name: 'mouse', position: 'left', size: 16 }}
                color="secondary">
                {typeof currentDopInfo?.insiders === 'number' ? (
                  `${formatter.number.round(currentDopInfo?.insiders, 1)}%`
                ) : (
                  <Skeleton isLoading className="h-5 w-6" />
                )}
              </Typography>
            </div>

            <Typography
              // border-3
              className="absolute right-0 mb-4 ml-auto flex h-9 w-9 items-center justify-center rounded-full !text-[8px] sm:mb-0"
              style={
                {
                  // borderColor: `var(--color-${bounding_curve === 100 ? 'yellow' : 'green'})`
                }
              }
              size="captain2"
              color={token.bounding_curve === 100 ? 'yellow' : 'green'}>
              <span className="absolute">{formatter.number.round(token.bounding_curve, 0)}%</span>
              <div className="relative h-full w-full">
                <svg viewBox="0 0 160 160" className="absolute h-full w-full -rotate-90">
                  <circle
                    r={radius}
                    cx="80"
                    cy="80"
                    fill="transparent"
                    className={clsx('stroke-darkGray-2 stroke-8')}
                  />
                  <circle
                    r={radius}
                    cx="80"
                    cy="80"
                    fill="transparent"
                    className={clsx(
                      {
                        'stroke-green': token.bounding_curve !== 100,
                        'stroke-yellow': token.bounding_curve === 100,
                      },
                      'stroke-8',
                    )}
                    strokeLinecap="round"
                    strokeDasharray={`${circumference}px`}
                    strokeDashoffset={`${offset}px`}
                  />
                </svg>
              </div>
            </Typography>
          </div>
        </div>
        <div className="bg-separator h-[0.5px] w-full" />
        <div className="flex items-center justify-between gap-1">
          <Stats
            creation_date={token.creation_date}
            count_holders={token.holders}
            count_tx={token.alltime_buy_txes + token.alltime_sell_txes}
            username={token.created_by.user_nickname}
          />

          <Typography size="captain1" color="green">
            MC: ${formatter.number.uiDefault(token.mcap * rate)}
          </Typography>
        </div>
      </div>
    </AnimationWrapper>
  );
};

export const LivestreamTokenFallback = ({ className }: { className?: string }) => {
  return (
    <div className={clsx('bg-darkGray-1 flex w-full flex-col gap-[10px] rounded-xl p-4', className)}>
      <Skeleton isLoading className="h-40 min-w-[250px] rounded-lg" />
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-[10px]">
          <div className="flex w-full items-center justify-between gap-1">
            <div className="flex items-center gap-1 sm:gap-2">
              <Skeleton isLoading className="h-7 w-7 rounded-full" />
              <Skeleton isLoading className="h-4 w-15" />
              <Skeleton isLoading className="h-4 w-19" />
              <Skeleton isLoading className="h-4 w-10" />
            </div>
            <Skeleton isLoading className="h-8 w-16 rounded-[6px]" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton isLoading className="h-6 w-27" />
            <div className="flex items-center gap-[6px]">
              {[1, 2, 3, 4].map((_, index) => (
                <Skeleton key={index} isLoading className="h-6 w-6 rounded-full" />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((_, index) => (
              <Skeleton key={index} isLoading className="h-5 w-13" />
            ))}
          </div>
        </div>
        <div className="bg-separator h-[0.5px] w-full" />
        <div className="flex items-center justify-between">
          <StatsFallback />
          <Skeleton isLoading className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
};
