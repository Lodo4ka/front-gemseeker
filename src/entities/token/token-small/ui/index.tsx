import { useUnit } from 'effector-react';
import { $isLoading, $token } from 'entities/token';
import { ProgressCircle } from 'shared/ui/progress';
import { Typography } from 'shared/ui/typography';
import { Skeleton } from 'shared/ui/skeleton';
import { Icon } from 'shared/ui/icon';
import { Button } from 'shared/ui/button';
import { Link } from 'atomic-router-react';
import { ImageHover } from 'shared/ui/image';
import { getFullUrlImg } from 'shared/lib/full-url-img';
import clsx from 'clsx';
import { subscribeInToken } from '../model';
import { $viewerStatus, ViewerStatus, $viewer } from 'shared/viewer/model';
import { routes } from 'shared/config/router';

type TokenSmallProps = {
  isFallback?: boolean;
};

export const TokenSmall = ({ isFallback = false }: TokenSmallProps) => {
  const token = useUnit($token);
  const isLoading = useUnit($isLoading);
  const [viewerStatus, viewer] = useUnit([$viewerStatus, $viewer]);

  const countSubscribers = useUnit(subscribeInToken.$countSubscribers);
  const [isFollow, clickFollow] = useUnit([subscribeInToken.$isFollow, subscribeInToken.clickedFollow]);

  if (isLoading || isFallback || !token) return <TokenSmallFallback />;

  return (
    <div className="bg-darkGray-1 flex w-full gap-[10px] rounded-xl px-4 py-5">
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex w-[calc(100%-60px)] flex-col gap-2">
            <div className="flex items-center gap-2">
              <ImageHover
                preview={getFullUrlImg(token.photo_hash, token.name)}
                alt={token.name}
                className="h-7 w-7 rounded-full"
              />
              <Typography weight="regular" size="subheadline1">
                {token.name}
              </Typography>
              <Typography
                className="!gap-2"
                icon={{ position: 'left', name: 'dot', size: 4 }}
                weight="regular"
                size="subheadline1"
                color="secondary">
                {token.symbol.toLocaleUpperCase()}
              </Typography>

              {(token.twitter || token.website || token.telegram) && (
                <Icon name="dot" size={4} className="text-secondary" />
              )}

              <div className="flex items-center gap-[6px]">
                {token.twitter && (
                  <Button
                    className={{ button: 'h-6 min-w-6 !rounded-full !p-0' }}
                    theme="darkGray"
                    as={Link}
                    target="_blank"
                    to={token.twitter ?? ''}
                    icon={{ position: 'center', name: 'twitter', size: 12 }}
                  />
                )}
                {token.website && (
                  <Button
                    className={{ button: 'h-6 min-w-6 !rounded-full !p-0' }}
                    theme="darkGray"
                    as={Link}
                    target="_blank"
                    to={token.website ?? ''}
                    icon={{ position: 'center', name: 'site', size: 12 }}
                  />
                )}
                {token.telegram && (
                  <Button
                    className={{ button: 'h-6 min-w-6 !rounded-full !p-0' }}
                    theme="darkGray"
                    as={Link}
                    target="_blank"
                    to={token.telegram ?? ''}
                    icon={{ position: 'center', name: 'telegram', size: 12 }}
                  />
                )}
              </div>
            </div>

            <Typography style={{ overflowWrap: 'anywhere' }} weight="regular" color="secondary">
              {token.description}
            </Typography>

            <Typography>Creator:</Typography>
            <div className="flex items-center gap-2">
              <Link
                to={routes.profile}
                params={{ id: token.created_by.user_id.toString() ?? '' }}
                className="flex items-center gap-2">
                <ImageHover
                  preview={getFullUrlImg(token.created_by.user_photo_hash, token.created_by.user_nickname)}
                  className="h-7 w-7 rounded-full"
                />

                <Typography
                  className="max-w-[120px] gap-[4px] truncate"
                  icon={{
                    name: 'dot',
                    size: 4,
                    position: 'left',
                  }}>
                  {token.created_by.user_nickname}

                  <Typography
                    color="secondary"
                    className="!gap-[4px]"
                    icon={{ name: 'dot', position: 'left', size: 3 }}>
                    {countSubscribers}
                  </Typography>
                </Typography>
              </Link>

              {viewerStatus === ViewerStatus.Authenticated && viewer?.user_id !== token.created_by.user_id && (
                <Button
                  onClick={clickFollow}
                  theme={isFollow ? 'quaternary' : 'primary'}
                  className={{
                    button: clsx('h-[30px] w-[110px] sm:mt-0'),
                  }}>
                  {isFollow ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </div>
          </div>
          <ProgressCircle size={50} stroke={3} value={token.bounding_curve} />
        </div>
      </div>
    </div>
  );
};

const TokenSmallFallback = () => {
  return (
    <div className="bg-darkGray-1 flex w-full gap-[10px] rounded-xl px-4 py-5">
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex w-[60%] flex-col gap-2">
            <div className="flex items-center gap-2">
              <Skeleton isLoading className="h-7 w-7 rounded-full" />
              <Skeleton isLoading className="h-5 w-20 rounded" />
              <Skeleton isLoading className="h-5 w-16 rounded" />
            </div>
            <Skeleton isLoading className="h-4 w-full rounded" />
          </div>
          <div className="flex items-center justify-center">
            <Skeleton isLoading className="h-[50px] w-[50px] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
