import { useUnit } from 'effector-react';
import { Typography } from 'shared/ui/typography';
import { IconName } from 'shared/ui/icon';
import { $isPausedNewData, type PauseVariant } from 'features/pause-control';

interface HeadPauseProps {
  title: string;
  pauseVariant: PauseVariant;
  iconName?: IconName;
}

export const HeadPause = ({ title, pauseVariant, iconName }: HeadPauseProps) => {
  const [isPause] = useUnit([$isPausedNewData]);
  return (
    <div className="flex gap-[24px]">
      <Typography
        size="headline4"
        className="!gap-2"
        color="secondary"
        icon={{ name: iconName ?? 'memepad', size: 20, position: 'left' }}>
        {title}
      </Typography>

      {(isPause === pauseVariant || isPause === 'all') && (
        <Typography
          size="headline4"
          className="!gap-2"
          color="secondary"
          icon={{ name: 'pause', size: 12, position: 'left' }}>
          Paused
        </Typography>
      )}
    </div>
  );
};
