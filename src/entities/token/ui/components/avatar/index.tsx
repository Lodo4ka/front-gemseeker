import clsx from 'clsx';
import { useMemo } from 'react';
import { formatter } from 'shared/lib/formatter';
import { Icon } from 'shared/ui/icon';
import { ImageHover } from 'shared/ui/image';
import { Skeleton } from 'shared/ui/skeleton';
import { Typography } from 'shared/ui/typography';

type AvatarProps = {
  url: string;
  progress?: number;
  className?: {
    container?: string;
    image?: string;
    stroke?: string;
    text?: string;
    icon?: string;
    icon_play?: string;
  };
  play?: boolean;
  isMigrate?: boolean;
};

const radius = 70;
const circumference = 2 * Math.PI * radius;

export const Avatar = ({ 
  url, 
  progress, 
  className, 
  play = false,
  isMigrate = false
}: AvatarProps) => {
  progress = isMigrate ? 100 : progress;
  
  const offset = useMemo(() => circumference - (progress ?? 0 / 100) * circumference, [progress]);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={clsx(`relative`, className?.container)}>
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle
            r={radius}
            cx="80"
            cy="80"
            fill="transparent"
            className={clsx('stroke-darkGray-2', className?.stroke)}
          />
          <circle
            r={radius}
            cx="80"
            cy="80"
            fill={progress === 100 ? "var(--color-yellow)" : "var(--color-darkGray-2)"}
            className={clsx(
              {
                'stroke-green': progress !== 100,
                'stroke-yellow': progress === 100,
              },
              className?.stroke,
            )}
            strokeLinecap="round"
            strokeDasharray={`${circumference}px`}
            strokeDashoffset={`${offset}px`}
          />
        </svg>
        
        <ImageHover 
          preview={url}
          alt="Avatar"
          classNameWrapper='!absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full'
          classNameImg={clsx(className?.image, 'rounded-full')}
        />

        {isMigrate && <Icon
          name="raydium"
          className={clsx('absolute top-0 left-0 cursor-pointer', className?.icon, {
            hidden: !isMigrate,
          })}
          size={20}
        />}

        {play && 
          <Icon
            name="play"
            className={clsx('absolute right-0 bottom-0 cursor-pointer', className?.icon_play, {
              hidden: !play,
            })}
            size={20}
          />
        }
      </div>
      {typeof(progress) === 'number' && 
        <Typography className={clsx(className?.text)} size="captain1" color={(progress === 100 || isMigrate) ? 'yellow' : 'green'}>
          {formatter.number.formatSmallNumber(+progress.toFixed(1))}%
        </Typography>
      }
    </div>
  );
};

type AvatarFallbackProps = {
  className?: {
    container?: string;
    text?: string;
    image?: string;
  };
};

export const AvatarFallback = ({ className }: AvatarFallbackProps) => {
  return (
    <div className={clsx('flex flex-col items-center gap-1', className?.container)}>
      <Skeleton isLoading className={clsx('rounded-full', className?.image)} />
      <Skeleton isLoading className={clsx('h-[18px] w-7', className?.text)} />
    </div>
  );
};
