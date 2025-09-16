import { Link } from 'atomic-router-react';
import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { $holdersStatus } from 'entities/token/model';
import { routes } from 'shared/config/router';
import { formatter } from 'shared/lib/formatter';
import { getFullUrlSolScanAccount } from 'shared/lib/full-url-tx';
import { Icon } from 'shared/ui/icon';
import { Typography } from 'shared/ui/typography';
import { ImageHover } from 'shared/ui/image';
import { getFullUrlImg } from 'shared/lib/full-url-img';

interface MakerProps {
  user_id: number;
  type?: string;
  maker: string;
}

const getColor = (type: string) => {
  if (type === 'BUY') return 'green';
  if (type === 'SELL') return 'red';
  if (type === 'MIGRATION') return 'yellow';
  return 'blue';
};

export const Maker = ({ user_id, type, maker }: MakerProps) => {
  const holdersStatus = useUnit($holdersStatus);
  const isNotTx = !type;
  const color = isNotTx ? 'primary' : getColor(type);
  const isContract = user_id === 0;

  return (
    <Link to={getFullUrlSolScanAccount(maker)} target="_blank" className="flex items-center gap-2">
      {isContract ? <Icon name="house" size={20} /> : <Icon name={holdersStatus?.[user_id] ?? 'shrimp'} size={20} />}

      <div className="flex flex-col items-center gap-[2px]">
        <Typography size="captain1" color={color}>
          {formatter.address(maker)}
          {isContract && '(Contract)'}
        </Typography>
      </div>
    </Link>
  );
};

interface UserProfileTableProps {
  user_id: number | null;
  user_photo_hash: string | null;
  user_nickname: string;
  address: string;
}

export const UserProfileTable = ({ user_id, user_nickname, user_photo_hash, address }: UserProfileTableProps) => {
  const isContract = user_id === null || user_id === 0;
  const nickname = isContract ? 'Contract' : user_nickname;

  const params = !isContract && user_id ? { id: (user_id ?? '0')?.toString() } : undefined;
  
  return (
    <Link
      to={isContract && !user_id ? getFullUrlSolScanAccount(address) : routes.profile}
      params={params}
      target="_blank"
      className="flex items-center gap-[5px]">
      <ImageHover
        preview={getFullUrlImg(user_photo_hash, nickname)}
        alt={nickname}
        className="h-[30px] w-[30px] rounded-full"
      />
      <Typography className="max-w-[110px] truncate">{nickname}</Typography>
    </Link>
  );
};
