import { invoke } from '@withease/factories';
import { Link } from 'atomic-router-react';

import { Avatar } from 'entities/token';
import { Typography } from '../typography';
import { CopyAddress } from 'features/copy-address';
import { copyFactory } from 'shared/lib/copy';
import { Icon } from '../icon';
import { Button } from '../button';
import { pinataUrl } from 'shared/lib/base-url';

const { copied: copiedTable } = invoke(copyFactory, 'Address copied to clipboard');

interface ColumnTokenProps {
  photo_hash: string;
  name: string;
  symbol: string;
  address: string;
  twitter?: string | null;
  website?: string | null;
  telegram?: string | null;
  bounding_curve: number;
  isPlay:boolean
}

export const ColumnToken = ({
  photo_hash,
  name,
  symbol,
  address,
  twitter,
  website,
  telegram,
  bounding_curve,
  isPlay,
}: ColumnTokenProps) => {
  const sizeIconSocLink = 'h-[18px] w-[18px] sm:h-6 sm:w-6 !rounded-full !p-[5px] sm:!p-[6px]';
  return (
    <div className="flex items-center gap-3">
      <Avatar
        url={pinataUrl(photo_hash) ?? ''}
        progress={bounding_curve}
        play={isPlay}
        className={{
          container: 'h-12 w-12 min-w-12',
          image: 'h-9 w-9 min-w-9',
          stroke: 'stroke-8',
          text: 'md:hidden',
        }}
      />
      <div className="gap-[4 px] flex flex-col sm:gap-[6px]">
        <div className="xs:gap-2 flex items-center gap-[6px]">
          <Typography size="subheadline2" className="max-md:!text-[12px]" weight="regular">
            {name}
          </Typography>
          <Typography
            className="!gap-2 max-md:!gap-1 max-md:!text-[12px]"
            color="secondary"
            size="subheadline2"
            icon={{ name: 'dot', size: 4, position: 'left' }}>
            {symbol}
          </Typography>
        </div>
        <div className="flex items-center gap-[4px] sm:gap-2">
          <CopyAddress
            address={address}
            copied={copiedTable}
            start={2}
            end={2}
            className={{ text: '!gap-1 max-sm:text-[12px]' }}
          />

          {(twitter || website || telegram) && <Icon name="dot" className="text-secondary" size={4} />}

          <div className="flex items-center gap-[4px] sm:gap-[6px]">
            {twitter && (
              <Button
                as={Link}
                to={twitter}
                target="_blank"
                theme="quaternary"
                className={{ button: sizeIconSocLink }}
                icon={{ name: 'twitter', size: 12, position: 'left' }}
              />
            )}
            {website && (
              <Button
                as={Link}
                to={website}
                target="_blank"
                theme="quaternary"
                className={{ button: sizeIconSocLink }}
                icon={{ name: 'site', size: 12, position: 'left' }}
              />
            )}
            {telegram && (
              <Button
                as={Link}
                to={telegram}
                target="_blank"
                theme="quaternary"
                className={{ button: sizeIconSocLink }}
                icon={{ name: 'telegram', size: 12, position: 'left' }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
