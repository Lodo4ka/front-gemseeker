import clsx from 'clsx';
import { Typography } from 'shared/ui/typography';

export type platformVariant = 'dashboard' | 'new_pair';
export const Platform = ({
  activePlatform,
  changePlatform,
  className,
}: {
  activePlatform: platformVariant;
  changePlatform: (platform: platformVariant) => void;
  className?: string;
}) => {
  const isActive = (platform: platformVariant) => activePlatform === platform;

  return (
    <div className={clsx('flex gap-[12px]', className)}>
      <Typography
        onClick={() => changePlatform('dashboard')}
        className="cursor-pointer"
        size="headline4"
        color={isActive('dashboard') ? 'primary' : 'secondary'}>
        Dashboard
      </Typography>

      <Typography
        onClick={() => changePlatform('new_pair')}
        className="cursor-pointer"
        size="headline4"
        color={isActive('new_pair') ? 'primary' : 'secondary'}>
        New Pair
      </Typography>
    </div>
  );
};
