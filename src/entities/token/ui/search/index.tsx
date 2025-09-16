import { CopyAddress } from 'features/copy-address';
import { Typography } from 'shared/ui/typography';
import { copied } from '../../model';
import { Image } from 'shared/ui/image';
import { Skeleton } from 'shared/ui/skeleton';
import { formatter } from 'shared/lib/formatter';
import { pinataUrl } from 'shared/lib/base-url';
import { routes } from 'shared/config/router';
import clsx from 'clsx';
import { useUnit } from 'effector-react';

interface TokenSearchProps {
  preview: string;
  name: string;
  address: string;
  price: number;
  changePrice24h: number;
  className?: string;
  onClose?: () => void;
}

export const TokenSearch = ({
  preview,
  name,
  address,
  price,
  changePrice24h,
  className,
  onClose,
}: TokenSearchProps) => {
  const toToken = useUnit(routes.token.open);
  return (
    <div
      onClick={() => {
        toToken({ address });
        onClose?.();
      }}
      className={clsx(
        'bg-darkGray-3 hover:bg-darkGray-2 flex cursor-pointer items-center justify-between rounded-lg p-3 transition-all duration-300 ease-in-out',
        className,
      )}>
      <div className="flex items-center gap-2">
        <Image preview={pinataUrl(preview)} className="bg-yellow h-8 w-8 rounded-full" />
        <div className="flex flex-col gap-1">
          <Typography size="captain1">{name}</Typography>
          <CopyAddress address={address} copied={copied} className={{ text: '!gap-1' }} />
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Typography size="captain1">${formatter.number.formatSmallNumber(price)}</Typography>
        <Typography size="captain1" color={changePrice24h > 0 ? 'green' : 'red'}>
          {changePrice24h > 0 ? '+' : '-'}
          {formatter.number.formatSmallNumber(changePrice24h)}
        </Typography>
      </div>
    </div>
  );
};

export const TokenSearchFallback = ({ className }: { className?: string }) => {
  return (
    <div className={clsx('bg-darkGray-3 flex items-center justify-between rounded-lg p-3', className)}>
      <div className="flex items-center gap-2">
        <Skeleton isLoading className="h-8 w-8 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton isLoading className="h-4 w-24" />
          <Skeleton isLoading className="h-3 w-32" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Skeleton isLoading className="h-4 w-20" />
        <Skeleton isLoading className="h-3 w-16" />
      </div>
    </div>
  );
};
