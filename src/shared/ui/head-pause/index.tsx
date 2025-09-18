import { useUnit } from 'effector-react';
import { Typography } from 'shared/ui/typography';
import { IconName } from 'shared/ui/icon';
import { $isPausedNewData, type PauseVariant } from 'features/pause-control';
import clsx from 'clsx';

interface HeadPauseProps {
  title: string;
  pauseVariant: PauseVariant;
  iconName?: IconName;
  className?: string;
  color?: 'nsfw' | 'secondary' | 'primary' | 'red' | 'yellow' | 'green' | 'blue';
}

export const HeadPause = ({ title, pauseVariant, iconName, className, color }: HeadPauseProps) => {
  const [isPause] = useUnit([$isPausedNewData]);
  return (
    <div className={clsx('flex gap-[24px]', className)}>
      <Typography
        size="headline4"
        className="!gap-2"
        color={color ?? 'secondary'}
        icon={{ name: iconName ?? 'memepad', size: 20, position: 'left' }}>
        {title}
      </Typography>

      {(isPause === pauseVariant || isPause === 'all') && (
        <Typography
          size="headline4"
          className="!gap-2"
          color={color ?? 'secondary'}
          icon={{ name: 'pause', size: 12, position: 'left' }}>
          Paused
        </Typography>
      )}
    </div>
  );
};
