import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { FC, useState, useCallback } from 'react';
import { routes } from 'shared/config/router';
import { Icon } from 'shared/ui/icon';
import { Navbar } from 'widgets/navbar';
import { $isAnchored, setAnchored } from '../model';

interface SidebarProps {
  className?: string;
}

const defaultWidth = 70,
  expandedWidth = 220;

export const Sidebar: FC<SidebarProps> = ({ className }) => {
  const toMain = useUnit(routes.memepad.open);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnchored, handleAnchor] = useUnit([$isAnchored, setAnchored])

  const handleMouseEnter = useCallback(() => setIsExpanded(true), []);
  const handleMouseLeave = useCallback(() => setIsExpanded(false), []);

  return (
    <aside
      onKeyDown={(event) => event.preventDefault()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ width: (isAnchored || isExpanded) ? expandedWidth : defaultWidth }}
      className={clsx(
        'fixed top-0 bottom-0 left-0 z-1000 h-screen',
        'bg-bg border-separator border-r',
        'transition-all duration-300 ease-in-out',
        'hidden lg:block',
        className,
      )}>
      <div className="flex h-full flex-col overflow-hidden">
        <div className="border-separator flex h-16 shrink-0 cursor-pointer items-center border-b px-4">
          <div onClick={toMain} className="flex cursor-pointer items-center hover:opacity-80">
            <Icon name="logoIcon" size={36} className="h-9 w-9 flex-shrink-0 transition-opacity" />
            <Icon
              name="logoText"
              className={clsx(
                'text-primary ml-1 !w-[110px] flex-shrink-0',
                'transition-all duration-300',
                (isExpanded || isAnchored) ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0',
              )}
            />
          </div>
          <Icon
            size={22}
            name="sidebar"
            onClick={handleAnchor}
            className={clsx(
              'ml-auto flex-shrink-0 cursor-pointer hover:opacity-80',
              'transition-all duration-300',
              (isExpanded || isAnchored) ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0',
            )}
          />
        </div>
        <div className="h-[calc(100%-4rem)] overflow-y-auto">
          <Navbar isOpen={(isExpanded || isAnchored)} />
        </div>
      </div>
    </aside>
  );
};
