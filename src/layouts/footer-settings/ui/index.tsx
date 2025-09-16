import clsx from 'clsx';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Button } from 'shared/ui/button';
import { items } from '../config';
import { IconName } from 'shared/ui/icon';
import { useUnit } from 'effector-react';
import { openedStartStreamModal } from '../model';
import { changedPause, $isPausedNewData } from 'features/pause-control';
import { modalsStore } from 'shared/lib/modal';
import { AdvancedSettingsModal } from 'entities/token';
import { buttonClicked } from 'features/stream';

export const FooterSettingsLayout = ({ children }: { children: ReactNode }) => {
  const [toCreateToken, toStartStreamModal] = useUnit([buttonClicked, openedStartStreamModal]);
  const [isPause, changePause] = useUnit([$isPausedNewData, changedPause]);
  const openSettingsModal = useUnit(modalsStore.openModal);

  const [opacity, setOpacity] = useState(1);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = (icon: string) => () => {
    switch (icon) {
      case 'add_token_menu':
        return toStartStreamModal();
      case 'play_menu':
        return changePause(!isPause ? 'all' : null);
      case 'camera_right':
        return toCreateToken();
      case 'settings_menu':
        return openSettingsModal(AdvancedSettingsModal);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;

      if (scrollDelta > 5) {
        setOpacity(0.4);
      } else if (scrollDelta < -10) {
        setOpacity(1);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFooterClick = () => {
    setOpacity(1);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
    }, 1000);
  };

  return (
    <div className="relative h-full w-full">
      <div className="h-full w-full pb-15">{children}</div>
      <div
        onClick={handleFooterClick}
        style={{ opacity, transition: 'opacity 0.2s ease-out' }}
        className={clsx(
          'fixed bottom-0 left-0 z-60 min-h-[63px] w-full',
          'bg-bg border-t-separator rounded-[20px_20px_3px_3px] border-t-[0.5px]',
          'flex items-center justify-center lg:hidden',
          'overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        )}>
        <div className="flex w-full max-w-[260px] items-center justify-between gap-3">
          {items.map((item) => (
            <Button
              onClick={handleClick(item.icon)}
              key={item.icon}
              icon={{
                name: item.icon === 'play_menu' ? (isPause ? 'pause_menu' : 'play_menu') : (item.icon as IconName),
                size: item.sizeIcon,
                position: 'right',
              }}
              theme="tertiary"
              className={{
                button: clsx('min-h-[32px] min-w-[32px] !p-0'),
                icon: 'h-full w-full',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
