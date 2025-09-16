import { CopyAddress } from 'features/copy-address';
import { api } from 'shared/api';
import { pinataUrl } from 'shared/lib/base-url';
import { Button } from 'shared/ui/button';
import { Typography } from 'shared/ui/typography';
import { infer as types } from 'zod';
import { copied } from '../../model';
import { Skeleton } from 'shared/ui/skeleton';
import { Link } from 'atomic-router-react';
import { Avatar } from 'entities/token';

export type MainInfoProps = {
  token: types<typeof api.contracts.token.single>;
};

export const MainInfo = ({ token }: MainInfoProps) => (
  <div className="flex w-full items-center gap-3">
    <Avatar
      url={pinataUrl(token.photo_hash) ?? ''}
      progress={token.bounding_curve}
      isMigrate={token.trade_finished}
      className={{
        container: 'h-12 w-12 min-w-12',
        image: 'h-9 w-9 min-w-9',
        icon_play: '!right-1 !bottom-1 !h-6 !w-6',
        icon: '!top-[-5px] !h-6 !w-6',
        stroke: 'stroke-[5px]',
      }}
    />
    <div className="flex w-full flex-col gap-2">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <Typography className="max-w-[180px] truncate" size="subheadline1">
          {token.name}
        </Typography>
        <Typography icon={{ position: 'left', name: 'dot', size: 4 }} color="secondary" size="subheadline2">
          {token.symbol.toLocaleUpperCase()}
        </Typography>
      </div>
      <div className="flex w-full items-center gap-2">
        <CopyAddress
          className={{ container: 'hidden max-[660px]:block' }}
          start={2}
          end={2}
          address={token.address}
          copied={copied}
        />
        <CopyAddress
          className={{ container: 'max-[660px]:hidden' }}
          start={5}
          end={4}
          address={token.address}
          copied={copied}
        />

        {/* {(token.twitter || token.website || token.telegram) && <Icon name="dot" size={4} className="text-secondary" />} */}
      </div>
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
  </div>
);

export const MainInfoSkeleton = () => (
  <div className="flex w-full items-center gap-3">
    <Skeleton isLoading className="h-11 min-w-11 rounded-full" />
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <Skeleton isLoading className="h-5 w-18 rounded" />
        <Skeleton isLoading className="h-1 w-1 rounded-full" />
        <Skeleton isLoading className="h-5 w-12 rounded" />
      </div>
      <div className="flex w-full items-center gap-2">
        <Skeleton isLoading className="h-4 w-24 rounded max-[660px]:w-13" />
        <Skeleton isLoading className="h-1 w-1 rounded-full" />
        <div className="flex items-center gap-[6px]">
          <Skeleton isLoading className="h-6 w-6 rounded-full" />
          <Skeleton isLoading className="h-6 w-6 rounded-full" />
          <Skeleton isLoading className="h-6 w-6 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);
