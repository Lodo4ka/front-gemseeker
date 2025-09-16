import clsx from 'clsx';
import { EventCallable, StoreWritable } from 'effector';
import { useUnit } from 'effector-react';
import { JSX, ReactNode, useEffect, useRef, useCallback, RefObject } from 'react';
import { InView } from 'react-intersection-observer';
import { WindowVirtualizer, VList, VListHandle } from 'virtua';
import { LoadedData } from 'shared/ui/loaded-data';
import { AnimatePresence } from 'framer-motion';

type ListWithPaginationProps<T extends unknown[]> = {
  list: T | null;
  isOnce?: boolean;
  noData?: JSX.Element;
  onLoaded?: EventCallable<void>;
  skeleton: {
    Element: ReactNode;
    count: number;
  };
  $isDataRanedOut: StoreWritable<boolean>;
  reachedEndOfList: EventCallable<void>;
  renderItem: (item: T[number], index: number) => ReactNode;
  className?: {
    wrapper?: string;
    list?: string;
    item?: string;
    inView?: string;
  };
  layout?: 'window' | 'list' | 'grid';
  reverse?: boolean;
  vListRef?: RefObject<VListHandle | null>;
  uniqueKey?: keyof T[number] | ((item: T[number]) => string | number);
};

export const ListWithPagination = <T extends unknown[]>({
  list,
  className,
  skeleton,
  isOnce = false,
  reachedEndOfList,
  noData,
  renderItem,
  $isDataRanedOut,
  onLoaded,
  layout = 'window',
  reverse = false,
  vListRef,
  uniqueKey,
}: ListWithPaginationProps<T>) => {
  const reachEndOfList = useUnit(reachedEndOfList);
  const isDataRanedOut = useUnit($isDataRanedOut);
  const isPrepend = useRef(false);
  const shouldStickToBottom = useRef(true);

  useEffect(() => {
    isPrepend.current = false;
  });

  useEffect(() => {
    if (!vListRef?.current || !reverse || !list || list.length === 0) return;
    if (!shouldStickToBottom.current) return;

    vListRef?.current.scrollToIndex(list.length - 1, { align: 'end' });
  }, [list?.length, reverse]);

  const onView = (inView: boolean) => {
    if (inView) {
      isPrepend.current = true;
      reachEndOfList();
    }
  };

  const getItemKey = useCallback(
    (item: T[number], index: number): string | number => {
      if (!uniqueKey) return index;

      if (typeof uniqueKey === 'function') {
        return uniqueKey(item);
      }

      const value = item[uniqueKey];
      return typeof value === 'string' || typeof value === 'number' ? value : index;
    },
    [uniqueKey],
  );

  return (
    <div className={clsx(className?.wrapper)}>
      {onLoaded && <LoadedData isOnce={isOnce} loadedData={onLoaded} />}

      {/* Window Virtualizer */}
      {layout === 'window' && (
        <WindowVirtualizer>
          {list === null &&
            Array.from({ length: skeleton.count }).map((_, i) => (
              <div key={`window-skeleton-${i}`}>{skeleton.Element}</div>
            ))}
          {list && list.length === 0 && noData}
          {list && list.length > 0 && list.map((item, index) => renderItem(item, index))}
          {list && list.length > 0 && !isDataRanedOut && (
            <>
              <InView
                as="div"
                delay={100}
                trackVisibility
                threshold={0.1}
                onChange={onView}
                rootMargin="100px"
                className="h-1 w-full"
              />
              {Array.from({ length: skeleton.count }).map((_, i) => (
                <div key={`window-more-skeleton-${i}`}>{skeleton.Element}</div>
              ))}
            </>
          )}
        </WindowVirtualizer>
      )}

      {/* VList Virtualizer */}
      {layout === 'list' && (
        <VList
          ref={vListRef}
          className={clsx(className?.list, {
            '[&>div]:!justify-center': list && list.length === 0,
          })}
          reverse={reverse}
          shift={isPrepend.current}
          onScroll={(offset) => {
            if (!vListRef?.current || !reverse) return;
            shouldStickToBottom.current = offset - vListRef.current.scrollSize + vListRef.current.viewportSize >= -1.5;
          }}>
          {list && list.length > 0 && !isDataRanedOut && reverse && (
            <>
              {Array.from({ length: skeleton.count }).map((_, i) => (
                <div key={`list-reverse-skeleton-${i}`}>{skeleton.Element}</div>
              ))}
              <InView
                as="div"
                delay={100}
                trackVisibility
                threshold={0.1}
                onChange={onView}
                rootMargin="100px"
                className="h-1 w-full"
              />
            </>
          )}

          {list === null &&
            Array.from({ length: skeleton.count }).map((_, i) => (
              <div key={`list-skeleton-${i}`}>{skeleton.Element}</div>
            ))}

          {list && list.length === 0 && noData}

          {list && list.length > 0 && list.map((item, index) => renderItem(item, index))}

          {list && list.length > 0 && !isDataRanedOut && !reverse && (
            <>
              <InView
                as="div"
                delay={100}
                trackVisibility
                threshold={0.1}
                onChange={onView}
                rootMargin="100px"
                className="h-1 w-full"
              />
              {Array.from({ length: skeleton.count }).map((_, i) => (
                <div key={`list-more-skeleton-${i}`}>{skeleton.Element}</div>
              ))}
            </>
          )}
        </VList>
      )}

      {/* Grid Layout */}
      {layout === 'grid' && (
        <AnimatePresence mode="popLayout">
          {list && list.length === 0 && noData}
          <div className={clsx('w-full', className?.list)}>
            {list === null &&
              Array.from({ length: skeleton.count }).map((_, i) => (
                <div key={`grid-skeleton-${i}`}>{skeleton.Element}</div>
              ))}

            {list &&
              list.length > 0 &&
              list.map((item, index) => {
                const key = getItemKey(item, index);
                return (
                  <div key={key} className={clsx('group relative', className?.item)}>
                    {renderItem(item, index)}
                  </div>
                );
              })}

            {list && list.length > 0 && !isDataRanedOut && (
              <>
                {Array.from({ length: skeleton.count }).map((_, i) => (
                  <div key={`grid-more-skeleton-${i}`}>{skeleton.Element}</div>
                ))}

                <InView
                  as="div"
                  delay={100}
                  trackVisibility
                  threshold={0.1}
                  onChange={onView}
                  rootMargin="100px"
                  className={clsx('pointer-events-none absolute h-1 w-full', className?.inView)}
                />
              </>
            )}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};
