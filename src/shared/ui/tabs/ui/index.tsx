import { clsx } from 'clsx';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'shared/ui/button';

import { TabsProps } from './index.type';

const TabsComponent = ({
  controllers,
  contents,
  className,
  activeTab,
  onTabChange,
  between,
  defaultActiveTab = 0,
  rightAction,
  queryParamName = 'tab_active',
}: TabsProps) => {
  const initialRender = useRef(true);

  const tabActiveFromQuery = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const name = params.get(queryParamName);
      if (!name) return null;
      const idx = controllers.findIndex(
        (c) => (c.name ?? String(c.children)).toString().toLowerCase() === name.toLowerCase(),
      );
      return idx >= 0 ? idx : null;
    } catch {
      return null;
    }
  }, [controllers, queryParamName]);

  const initialActiveTab = tabActiveFromQuery ?? activeTab ?? defaultActiveTab;

  const [active, setActive] = useState<number>(initialActiveTab);
  const [mountedTabs, setMountedTabs] = useState<number[]>([initialActiveTab]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (typeof activeTab === 'number' && activeTab !== active) {
      setActive(activeTab);
      if (!mountedTabs.includes(activeTab)) {
        setMountedTabs((prev) => [...prev, activeTab]);
      }
    }
  }, [activeTab, active, mountedTabs]);

  const onSetActive = useCallback(
    (index: number, onClick?: () => void) => () => {
      onClick?.();
      setActive(index);
      onTabChange?.(index);

      try {
        const params = new URLSearchParams(window.location.search);
        const name = controllers[index]?.name ?? String(controllers[index]?.children ?? index);
        params.set(queryParamName, name.toString());
        const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
        window.history.replaceState({}, '', newUrl);
      } catch {}

      if (!mountedTabs.includes(index)) {
        setMountedTabs((prevState) => [...prevState, index]);
      }
    },
    [mountedTabs, onTabChange, controllers, queryParamName],
  );

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const name = params.get(queryParamName);
      if (name) {
        const idx = controllers.findIndex(
          (c) => (c.name ?? String(c.children)).toString().toLowerCase() === name.toLowerCase(),
        );
        if (idx >= 0 && idx !== active) {
          setActive(idx);
          onTabChange?.(idx);
        }
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [controllers, queryParamName, active, onTabChange]);
  
  return (
    <div className={clsx('flex w-full flex-col gap-4', className?.wrapper)}>
      <div className="flex w-full items-center justify-between gap-x-1 gap-y-2 flex-wrap">
        <div
          className={clsx(
            'flex items-center gap-0 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            'border-separator w-fit max-w-full rounded-lg border-[0.5px]',
            className?.controllers?.wrapper,
          )}>
          {controllers.map((controllerProps, index) => (
            <Button
              key={index}
              theme={controllerProps.theme || 'tertiary'}
              isActive={active === index}
              {...controllerProps}
              onClick={onSetActive(index, controllerProps.onClick as () => void)}
              className={{
                button: clsx(
                  '!border-r-separator hover:bg-darkGray-1 text-secondary !flex gap-2 rounded-none !border-r-[0.5px] px-3 py-2 transition-all duration-300 ease-in-out last:!border-r-0',
                  className?.controllers?.controller?.default,
                  controllerProps.className?.button,
                  index === active &&
                    clsx(
                      '!bg-darkGray-1 !text-primary flex-nowrap',
                      className?.controllers?.controller?.active,
                      controllerProps.activeClassName,
                    ),
                ),
              }}>
              {controllerProps.children}
            </Button>
          ))}
        </div>

        {rightAction?.tabActive === active && rightAction?.content}
      </div>
      {between && between}
      <div className={clsx('w-full', className?.content)}>
        {contents.map((content, index) => {
          if (mountedTabs.includes(index)) {
            return (
              <div
                key={index}
                className={clsx(
                  'w-full',
                  {
                    hidden: active !== index,
                  },
                  className?.content,
                )}>
                {content}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export const Tabs = memo(TabsComponent);
