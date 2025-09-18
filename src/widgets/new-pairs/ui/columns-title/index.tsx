import { useUnit } from 'effector-react';
import { Typography } from 'shared/ui/typography';
import { $isPausedNewData, PauseVariant } from 'features/pause-control';
import clsx from 'clsx';

interface ColumnTitleVariants {
  text: string;
  icon: 'flag' | 'folder' | 'trending';
  variant: PauseVariant;
}

export const columnsProps: Record<number, ColumnTitleVariants> = {
  1: {
    text: 'New Creations',
    icon: 'folder',
    variant: 'pump_new_creation',
  },
  2: {
    text: 'Burnt',
    icon: 'trending',
    variant: 'trending',
  },
  3: {
    text: 'DEXScreener Spent',
    icon: 'flag',
    variant: 'pump_completed',
  },
};

interface ColumnTitleProps {
  idx: number;
  className?: string;
}

export const ColumnTitle = ({ idx, className }: ColumnTitleProps) => {
  const isPause = useUnit($isPausedNewData);
  return (
    <div className={clsx('flex gap-[15px]', className)}>
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
