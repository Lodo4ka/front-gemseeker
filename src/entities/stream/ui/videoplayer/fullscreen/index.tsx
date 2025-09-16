import { ReactNode, useEffect, useRef } from 'react';
import { Icon } from 'shared/ui/icon';
import { VolumeControl } from '../volume';
import clsx from 'clsx';

export type FullScreenWrapperProps = {
  children: ReactNode;
  setIsFullscreen: (isFullscreen: boolean) => void;
  className?: {
    player?: string;
    volume?: string;
    fullscreen?: string;
  };
};

export const FullScreenWrapper = ({ children, setIsFullscreen, className }: FullScreenWrapperProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (document.fullscreenElement) {
      setIsFullscreen(false);
      document.exitFullscreen();
    } else {
      setIsFullscreen(true);
      el.requestFullscreen().catch((err) => {
        console.error('Ошибка при переходе в полноэкранный режим:', err);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [setIsFullscreen]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <div
        className={clsx(
          'bg-darkGray-3/30 absolute right-3 bottom-3 z-10 flex items-center gap-4 rounded-lg p-[3px]',
          className?.player,
        )}>
        <VolumeControl className={className?.volume} />
        <Icon
          size={24}
          onClick={toggleFullscreen}
          name="fullscreen"
          className={clsx(
            'text-primary cursor-pointer transition-all duration-200 hover:scale-110 max-sm:hidden',
            className?.fullscreen,
          )}
        />
      </div>

      {children}
    </div>
  );
};
