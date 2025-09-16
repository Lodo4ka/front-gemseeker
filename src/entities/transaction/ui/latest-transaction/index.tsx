import { Link } from 'atomic-router-react';
import clsx from 'clsx';
import { RecentResponse } from 'shared/api/queries/transaction/list';
import { routes } from 'shared/config/router';
import { formatter } from 'shared/lib/formatter';
import { Icon } from 'shared/ui/icon';
import { ImageHover } from 'shared/ui/image';
import { Skeleton } from 'shared/ui/skeleton';
import { TimeAgo } from 'shared/ui/time-ago';
import { Typography, TypographyColor } from 'shared/ui/typography';
import { type PauseVariant } from 'features/pause-control';
import { getFullUrlImg } from 'shared/lib/full-url-img';

import { AnimationWrapper } from 'shared/ui/update-wrapper';

type LatestTransactionProps = {
  className?: string;
  variantPause?: PauseVariant;
  transaction: RecentResponse[0];
  isUpdated?: boolean;
};

export const LatestTransaction = ({
  className,
  transaction,
  variantPause,
  isUpdated = false,
}: LatestTransactionProps) => {
  const isStreamCreated = transaction.type === 'STREAM_CREATED';
  const isSell = transaction.type === 'SELL';
  const isBuy = transaction.type === 'BUY';
  const isDeploy = transaction.type === 'DEPLOY';
  const isMigration = transaction.type === 'MIGRATION';
  const isDonationReceived = transaction.type === 'DONATION_RECEIVED';
  const isStreamFinished = transaction.type === 'STREAM_FINISHED';

  let colorTx: TypographyColor = 'blue';
  let colorBgTx = '--color-blue-gradient-dark';
  let titleVariant = '';

  if (isSell) {
    colorTx = 'red';
    colorBgTx = '--color-red-gradient-dark';
    titleVariant = 'Sell';
  } else if (isBuy) {
    colorTx = 'green';
    colorBgTx = '--color-green-gradient-dark';
    titleVariant = 'Buy';
  } else if (isDeploy) {
    titleVariant = 'Created';
  } else if (isMigration) {
    titleVariant = 'Migration';
    colorBgTx = '--color-gold-gradient-dark';
    colorTx = 'yellow';
  } else if (isStreamCreated) {
    titleVariant = 'Start stream';
    colorBgTx = '--color-purple-gradient-dark';
    colorTx = 'nsfw';
  } else if (isDonationReceived) {
    titleVariant = 'Donation';
    colorBgTx = '--color-purple-gradient-dark';
    colorTx = 'nsfw';
  } else if (isStreamFinished) {
    titleVariant = 'Stream finished';
    colorBgTx = '--color-red-gradient-dark';
    colorTx = 'red';
  }

  const tokenAddress = transaction.token_address;
  const tokenPhotoHash = transaction.token_photo_hash || transaction.user_info.user_photo_hash;

  const tokenName = transaction.token_name;
  const tokenSymbol = transaction.token_symbol;
  const userName = transaction.user_info.user_nickname;
  const userId = transaction.user_info.user_id;
  const timestamp = transaction.timestamp;
  const solAmount = transaction.sol_amount;
  const donationAmount = transaction.sol_amount;

  return (
    <AnimationWrapper
      isUpdated={isUpdated}
      pauseVariant={variantPause ?? 'recent_tx'}
      style={{ background: `var(${colorBgTx})` }}
      className={clsx(className, 'relative z-[3] flex w-full items-center gap-2 rounded-lg p-3')}>
      {tokenAddress && (
        <Link to={routes.token} params={{ address: tokenAddress }} className="absolute inset-0 z-0 h-full w-full" />
      )}
      {!tokenAddress && (
        <Link
          to={routes.stream}
          params={{ slug: transaction.slug ?? '' }}
          className="absolute inset-0 z-0 h-full w-full"
        />
      )}
      <ImageHover
        preview={getFullUrlImg(tokenPhotoHash, transaction.user_info.user_nickname)}
        className="bg-primary h-11 max-w-11 min-w-11 rounded-full "
      />
      <div className="flex w-full justify-between">
        <div className="flex flex-col gap-[6px]">
          {tokenName && tokenSymbol ? (
            <div className="flex items-center gap-1">
              <Typography className="max-w-[90px] truncate" size="subheadline2" weight="regular">
                {tokenName}
              </Typography>
              <Icon name="dot" size={4} className="text-secondary" />
              <Typography color="secondary" size="subheadline2" weight="regular">
                {tokenSymbol}
              </Typography>
            </div>
          ) : (
            <Typography className="max-w-[130px] truncate" size="subheadline2" weight="regular">
              {userName}
            </Typography>
          )}

          {tokenName && tokenSymbol ? (
            <div className="flex items-center gap-2">
              <Icon name="profile" size={16} className="text-secondary" />
              <Typography
                as={Link}
                to={routes.profile}
                params={{ id: String(userId) }}
                className="relative z-1 max-w-[100px] min-w-0 truncate text-ellipsis"
                color="secondary">
                {userName}
              </Typography>
            </div>
          ) : (
            <Typography className="h-[21px]" />
          )}
        </div>
        <div className="flex flex-col gap-[6px]">
          <div className="flex items-center justify-end gap-2">
            <Typography size="subheadline2" color={colorTx}>
              {titleVariant}
            </Typography>

            {isDonationReceived && (
              <Typography
                size="subheadline2"
                className="!gap-1"
                icon={{ name: 'solana', position: 'left' }}
                color={colorTx}>
                +{formatter.number.formatSmallNumber(donationAmount ?? 0)}
              </Typography>
            )}

            {(isSell || isBuy) && !isStreamCreated && (
              <Typography
                size="subheadline2"
                className="!gap-1"
                icon={{ name: 'solana', position: 'left' }}
                color={colorTx}>
                {isSell ? '-' : '+'}
                {formatter.number.formatSmallNumber(solAmount ?? 0)}
              </Typography>
            )}
          </div>
          <Typography className="justify-end" size="subheadline2" weight="regular" color="secondary">
            <TimeAgo unixTimestamp={timestamp} />
          </Typography>
        </div>
      </div>
    </AnimationWrapper>
  );
};

export const LatestTransactionFallback = ({ className }: { className?: string }) => {
  return (
    <div className={clsx('bg-darkGray-1 flex w-full items-center gap-2 rounded-lg p-3', className)}>
      <Skeleton isLoading className="h-9 min-w-9 rounded-full md:h-11 md:min-w-11" />
      <div className="flex w-full justify-between">
        <div className="flex flex-col gap-[5px] md:gap-[10px]">
          <div className="flex items-center gap-1 sm:gap-2">
            <Skeleton isLoading className="h-[18px] min-w-15 sm:max-w-20 md:max-w-24" />
            <Skeleton isLoading className="h-1 w-1 rounded-full" />
            <Skeleton isLoading className="h-[18px] min-w-10 sm:max-w-15 md:max-w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton isLoading className="h-[16px] min-w-4" />
            <Skeleton isLoading className="h-[16px] min-w-12 md:max-w-16" />
          </div>
        </div>
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center justify-end gap-2">
            <Skeleton isLoading className="h-[18px] min-w-8" />
            <div className="flex items-center gap-1">
              <Skeleton isLoading className="h-4 min-w-4" />
              <Skeleton isLoading className="h-[18px] min-w-12" />
            </div>
          </div>
          <div className="flex justify-end">
            <Skeleton isLoading className="h-[18px] min-w-12" />
          </div>
        </div>
      </div>
    </div>
  );
};
