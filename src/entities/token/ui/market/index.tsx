import { useEffect, useState, useRef } from 'react';
import { useUnit } from 'effector-react';
import clsx from 'clsx';
import { Link } from 'atomic-router-react';
import { motion } from 'framer-motion';

import { Button } from 'shared/ui/button';
import { Icon } from 'shared/ui/icon';
import { Typography } from 'shared/ui/typography';
import { copied } from '../../model';
import { loadedToken, $tokensDopInfo } from '../../model/dop-info';
import { Stats, Avatar, AvatarFallback, StatsFallback } from '..';
import { CopyAddress } from 'features/copy-address';
import { Skeleton } from 'shared/ui/skeleton';
import { QuickBuyButton } from 'features/quick-buy';
import { TokensListTokenResponse } from 'shared/api/queries/token/tokens-factory';
import { formatter } from 'shared/lib/formatter';
import { routes } from 'shared/config/router';
import s from './style.module.css';
import { pinataUrl } from 'shared/lib/base-url';
import { LoadedData } from 'shared/ui/loaded-data';
import { useMemo } from 'react';
import { $rate } from 'features/exchange-rate';
import { AnimationWrapper } from 'shared/ui/update-wrapper';

type TokenMarketProps = {
  className?: string;
  token: TokensListTokenResponse[0];
};

export const TokenMarket = ({ className, token }: TokenMarketProps) => {
  const [dopInfo, rate] = useUnit([$tokensDopInfo, $rate]);
  const [isUpdated, setIsUpdated] = useState(false);
  const prevTokenRef = useRef<TokensListTokenResponse[0] | null>(null);

  useEffect(() => {
    if (!prevTokenRef.current) {
      prevTokenRef.current = token;
      return;
    }

    const isChanged = ['price', 'mcap', 'messages', 'holders', 'alltime_buy_txes', 'alltime_sell_txes'].some(
      (key) =>
        prevTokenRef.current?.[key as keyof TokensListTokenResponse[0]] !==
        token[key as keyof TokensListTokenResponse[0]],
    );

    if (isChanged) {
      setIsUpdated(true);
      const timer = setTimeout(() => setIsUpdated(false), 800);
      return () => clearTimeout(timer);
    }

    prevTokenRef.current = token;
  }, [token]);

  const mcap = useMemo(() => token.mcap * rate, [dopInfo, token.mcap]);
  const currentDopInfo = useMemo(() => {
    const customInputFieldMetaInfo = dopInfo?.[token.address];
    if (customInputFieldMetaInfo) {
      return customInputFieldMetaInfo;
    }
    return Object.values(dopInfo)[0];
  }, [dopInfo, token.address]);

  return (
    <AnimationWrapper
      style={{
        background: token.is_streaming ? 'var(--color-red-gradient-dark)' : undefined,
      }}
      className={clsx('bg-darkGray-1 hover:bg-darkGray-3 flex items-center rounded-xl p-2 md:gap-4 md:p-4', className)}
      isUpdated={isUpdated}
      pauseVariant="market">
      <Link to={routes.token} params={{ address: token.address }} className="absolute inset-0 z-0 h-full w-full" />

      <LoadedData
        className="-z-1"
        loadedData={loadedToken}
        isOnce
        params={{
          address: token.address,
          creator: token.deployer_wallet,
        }}
        isFullSize
      />
      <div className="hidden h-full flex-col items-center justify-between md:flex">
        <Avatar
          url={pinataUrl(token.photo_hash) ?? ''}
          progress={token.bounding_curve}
          isMigrate={token.trade_finished}
          play={token.is_streaming}
          className={{
            container: 'h-19 w-19 min-w-19',
            image: 'h-15 w-15 min-w-15',
            icon_play: '!right-1 !bottom-1 !h-6 !w-6',
            icon: '!top-[2px] !left-1 !h-6 !w-6',
            stroke: 'stroke-[5px]',
            text: 'hidden md:flex',
          }}
        />

        {/* <Typography className="text-nowrap" size="captain1" color="green">
          MC: ${formatter.number.formatSmallNumber(mcap)}
        </Typography> */}
      </div>

      <div className="flex w-full flex-col gap-3 overflow-x-hidden">
        <div className="flex w-full items-center gap-2 md:gap-0">
          <Avatar
            url={pinataUrl(token.photo_hash) ?? ''}
            progress={token.bounding_curve}
            isMigrate={token.trade_finished}
            play={token.is_streaming}
            className={{
              container: 'h-12 w-12 min-w-12 md:hidden',
              image: 'h-9 w-9 min-w-9',
              stroke: 'stroke-8',
              text: 'md:hidden',
            }}
          />
          <div className="flex w-full flex-col gap-[6px]">
            <div className="flex w-full items-center justify-between">
              <div className="xs:gap-2 flex items-center gap-[6px]">
                <Typography
                  className="xs:!gap-2 max-w-[160px] !gap-[6px] truncate !text-white max-md:!gap-1 max-md:!text-[12px]"
                  color="secondary"
                  size="subheadline2"
                  icon={{ name: 'dot', size: 4, position: 'right' }}>
                  {token.name}
                </Typography>
                <Typography size="subheadline2" color="secondary" className="truncate max-md:!text-[12px]">
                  {token.created_by.user_nickname}
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
                  {formatter.number.uiDefault(token.messages)}
                </Typography>
                {token.is_nsfw && (
                  <>
                    <Icon name="dot" className="text-secondary" size={4} />
                    <Typography size="subheadline2" className={s.nsfw}>
                      NSFW
                    </Typography>
                  </>
                )}
              </div>

              <QuickBuyButton token={token} className="relative z-1" />
            </div>

            <div className="flex items-center justify-between"></div>
            <div className="flex items-center gap-1">
              <CopyAddress address={token.address} copied={copied} className={{ text: 'relative z-1 !gap-1' }} />

              {(token.twitter || token.website || token.telegram || token.youtube) && (
                <Icon name="dot" className="text-secondary" size={4} />
              )}

              <div className="relative z-1 flex items-center gap-[6px]">
                {token.twitter && (
                  <Button
                    as={Link}
                    to={token.twitter}
                    theme="quaternary"
                    className={{ button: 'h-6 w-6 !rounded-full !p-[6px]' }}
                    icon={{ name: 'twitter', size: 12, position: 'left' }}
                  />
                )}

                {token.website && (
                  <Button
                    as={Link}
                    to={token.website}
                    theme="quaternary"
                    className={{ button: 'h-6 w-6 !rounded-full !p-[6px]' }}
                    icon={{ name: 'site', size: 12, position: 'left' }}
                  />
                )}

                {token.telegram && (
                  <Button
                    as={Link}
                    to={token.telegram}
                    theme="quaternary"
                    className={{ button: 'h-6 w-6 !rounded-full !p-[6px]' }}
                    icon={{ name: 'telegram', size: 12, position: 'left' }}
                  />
                )}

                {token.youtube && (
                  <Button
                    theme="quaternary"
                    className={{ button: 'h-6 w-6 !rounded-full !p-[6px]' }}
                    icon={{ name: 'youtube', size: 12, position: 'left' }}
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
                {typeof currentDopInfo?.snipers != 'number' && <Skeleton isLoading className="h-5 w-6" />}
              </Typography>
              <Typography
                size="captain1"
                className="!gap-1"
                icon={{ name: 'cook', position: 'left', size: 16 }}
                color="secondary">
                {typeof currentDopInfo?.creator === 'number' && `${formatter.number.round(currentDopInfo.creator, 1)}%`}
                {typeof currentDopInfo?.creator != 'number' && <Skeleton isLoading className="h-5 w-6" />}
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
                {`${formatter.number.round(currentDopInfo?.insiders ?? 0, 1)}%`}
                {typeof currentDopInfo?.insiders != 'number' && <Skeleton isLoading className="h-5 w-6" />}
              </Typography>
              {token.is_streaming && (
                <Typography className="gap-[3px]" color="secondary" weight="regular" size="captain1">
                  <Icon className={s.live_dot} name="dot" size={6} />
                  Live
                </Typography>
              )}
            </div>
          </div>
        </div>
        <div className="bg-separator h-[0.5px] w-full" />
        <div className="flex w-full items-center justify-between gap-1 overflow-hidden">
          <Stats
            className={clsx('relative z-1 w-full overflow-auto', s.custom_scrollbar)}
            creation_date={token.creation_date}
            count_holders={token.holders}
            count_tx={token.alltime_buy_txes + token.alltime_sell_txes}
            username={token.created_by.user_nickname}
          />

          <Typography className="flex text-nowrap" size="captain1" color="green">
            MC: ${formatter.number.uiDefault(mcap)}
          </Typography>
        </div>
      </div>
    </AnimationWrapper>
  );
};
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
