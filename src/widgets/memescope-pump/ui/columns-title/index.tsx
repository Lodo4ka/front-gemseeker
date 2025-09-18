import { useUnit } from 'effector-react';
import { Typography } from 'shared/ui/typography';
import { $isPausedNewData, PauseVariant } from 'features/pause-control';

interface ColumnTitleVariants {
  text: string;
  icon: 'flag' | 'folder' | 'hourglass';
  variant: PauseVariant;
}

export const columnsProps: Record<number, ColumnTitleVariants> = {
  1: {
    text: 'New Creations',
    icon: 'folder',
    variant: 'pump_new_creation',
  },
  2: {
    text: 'Completing',
    icon: 'hourglass',
    variant: 'pump_completing',
  },
  3: {
    text: 'Completed',
    icon: 'flag',
    variant: 'pump_completed',
  },
};

interface ColumnTitleProps {
  idx: number;
}

export const ColumnTitle = ({ idx }: ColumnTitleProps) => {
  const isPause = useUnit($isPausedNewData);
  return (
    <div className="flex gap-[15px]">
      <Typography
        color="secondary"
        size="subheadline1"
        icon={{ name: columnsProps[idx]?.icon ?? 'folder', position: 'left', size: 18 }}>
        <span className="ml-[8px]">{columnsProps[idx]?.text}</span>
      </Typography>

      {isPause === columnsProps[idx]?.variant && (
        <Typography color="green" size="subheadline1" icon={{ name: 'pause', position: 'left', size: 12 }}>
          Paused
        </Typography>
      )}
    </div>
  );
};
