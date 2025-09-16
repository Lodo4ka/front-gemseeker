import { JSX, ReactNode, memo, useState, useRef, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { InView } from 'react-intersection-observer';
import { EventCallable, StoreWritable } from 'effector';
import { LoadedData } from 'shared/ui/loaded-data';
import { AnimatePresence, motion, useAnimationControls, Variants } from 'framer-motion';
import { animations } from 'shared/config/animations';
import { Skeleton } from 'shared/ui/skeleton';
import { Skeletons, TableFallback } from '../components';
import { useHover } from 'shared/lib/use-hover';
import { PauseVariant } from 'features/pause-control';

export type HashTableData<T> = Record<string, T>;
export type KeyType = string | number;

export interface HashTableColumn<T> {
  key: string;
  title?: string | ReactNode;
  render?: (item: T, key: KeyType, additionalInfo?: Record<any, any>, isLastRow?: boolean) => ReactNode;
  className?: string;
  last?: (item: T) => ReactNode;
  isNotOnClick?: boolean;
}

export interface HashTableProps<T> {
  columns: HashTableColumn<T>[];
  keys: KeyType[] | null;
  data: HashTableData<T>;
  animation?: {
    default?: Variants;
    first?: Variants;
    last?: Variants;
  };
  onRowClick?: (key: KeyType, item: T) => void;
  isOnce?: boolean;
  className?: {
    wrapper?: string;
    container?: string;
    table?: string;
    header?: string;
    headerCell?: string;
    body?: string;
    row?: string;
    cell?: string;
    lastRow?: string;
  };
  rowsCount?: number;
  reachedEndOfList: EventCallable<void>;
  noData?: JSX.Element;
  $isDataRanedOut: StoreWritable<boolean>;
  onLoaded?: EventCallable<void>;
  isAnimationFisrt?: boolean;
  additionalInfo?: Record<any, any>;
  isHoverable?: boolean;
  isAnimationsEnabled?: boolean;
  pauseVariant?: PauseVariant;
}

interface HashTableRowProps<T> {
  keyValue: KeyType;
  item: T | null;
  columns: HashTableColumn<T>[];
  isLast: boolean;
  onClick?: (key: KeyType, item: T) => void;
  className?: HashTableProps<T>['className'];
  animation?: Variants;
  additionalInfo?: Record<any, any>;
  isAnimationsEnabled: boolean;
}

const HashTableRowComponent = <T extends unknown>({
  keyValue,
  item,
  columns,
  isAnimationsEnabled,
  isLast,
  onClick,
  className,
  animation,
  additionalInfo,
  index,
}: HashTableRowProps<T> & { index: number }) => {
  const [isUpdated, setIsUpdated] = useState(false);
  const controls = useAnimationControls();
  const prevDataRef = useRef<T | null>(null);
  const trackedKeys = useRef<Array<keyof T>>([
    'price',
    'mcap',
    'messages',
    'holders',
    'alltime_buy_txes',
    'alltime_sell_txes',
  ] as Array<keyof T>);

  useEffect(() => {
    if (!item) {
      prevDataRef.current = null;
      return;
    }

    if (prevDataRef.current === null) {
      prevDataRef.current = item;
      return;
    }

    let isChanged = false;

    for (const key of trackedKeys.current) {
      const prevValue = prevDataRef.current?.[key];
      const currentValue = item[key];

      if (typeof prevValue === 'object' && typeof currentValue === 'object') {
        if (JSON.stringify(prevValue) !== JSON.stringify(currentValue)) {
          isChanged = true;
          break;
        }
      } else if (prevValue !== currentValue) {
        isChanged = true;
        break;
      }
    }

    if (isChanged) {
      setIsUpdated(true);
      const timer = setTimeout(() => setIsUpdated(false), 1000);
      return () => clearTimeout(timer);
    }

    prevDataRef.current = item;
  }, [item, index, keyValue]);

  useEffect(() => {
    if (isUpdated) {
      controls.start('animate');
    }
  }, [isUpdated]);

  return (
    <motion.tr
      initial="initial"
      animate={controls}
      exit="exit"
      variants={isAnimationsEnabled ? animation : undefined}
      transition={{ duration: 0.5 }}
      className={clsx(
        'hover:bg-darkGray-3 group relative',
        { 'border-b-separator border-b-[0.5px]': !isLast },
        className?.row,
      )}>
      {columns.map((column) => (
        <td
          key={column.key}
          className={clsx('px-4 py-3', className?.cell, column?.className)}
          onClick={() => {
            if (!column.isNotOnClick && item && onClick) {
              onClick(keyValue, item);
            }
          }}>
          {item ? (
            column.render?.(item, keyValue, additionalInfo, isLast)
          ) : (
            <Skeleton isLoading className="h-5 w-full" />
          )}
        </td>
      ))}
    </motion.tr>
  );
};
const HashTableRow = memo(HashTableRowComponent) as typeof HashTableRowComponent;

const HashTableComponent = <T extends unknown>({
  columns,
  keys,
  data,
  onRowClick,
  isOnce = true,
  className,
  reachedEndOfList,
  $isDataRanedOut,
  rowsCount = 10,
  onLoaded,
  animation,
  isHoverable = false,
  isAnimationsEnabled = false,
  additionalInfo,
  pauseVariant,
  noData,
}: HashTableProps<T>) => {
  const reachEndOfList = useUnit(reachedEndOfList);
  const isDataRanedOut = useUnit($isDataRanedOut);
  const { handleMouseOver, handleMouseOut, isMobile } = useHover({ pauseVariant: pauseVariant ?? 'market' });

  const onView = (inView: boolean) => {
    if (inView) reachEndOfList();
  };

  const getRowAnimation = (index: number, length: number): Variants => {
    if (index === 0) return animation?.first || animations.table.flashAndShake;
    if (index === length - 1) return animation?.last || animations.table.flash.last;
    return animation?.default || animations.table.flash.default;
  };

  if (keys === null) {
    return (
      <>
        {onLoaded && <LoadedData isOnce={isOnce} loadedData={onLoaded} />}
        <TableFallback columnsCount={columns.length} rowsCount={rowsCount} className={className} />
      </>
    );
  }

  if (keys.length === 0) {
    return noData || <div>No data available</div>;
  }

  return (
    <div
      onMouseOver={!isMobile && isHoverable ? handleMouseOver : undefined}
      onMouseOut={!isMobile && isHoverable ? handleMouseOut : undefined}
      className={clsx('bg-darkGray-1 w-full overflow-hidden rounded-xl', className?.wrapper)}>
      <div
        className={clsx(
          'w-full overflow-auto',
          '[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2',
          '[&::-webkit-scrollbar-thumb]:rounded-full',
          '[&::-webkit-scrollbar-thumb]:bg-darkGray-3',
          'rotate-x-180 [&::-webkit-scrollbar-track]:rounded-full',
          '[&::-webkit-scrollbar-track]:bg-darkGray-1',
        )}>
        <div className={clsx('w-fit min-w-full rotate-x-180', className?.container)}>
          <div className={clsx('bg-darkGray-1 overflow-hidden rounded-xl', className?.wrapper)}>
            <table className={clsx('w-full', className?.table)}>
              <thead className={clsx('border-b-separator border-b-[0.5px]', className?.header)}>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={clsx(
                        'px-4 py-[10px] text-left whitespace-nowrap',
                        'text-secondary text-sm font-normal',
                        className?.headerCell,
                        column?.className,
                      )}>
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={clsx(className?.body)}>
                <AnimatePresence mode="popLayout" initial={false}>
                  {keys.map((key, index) => {
                    const isLast = index === keys.length - 1;
                    const item = data[key.toString()] ?? null;

                    return (
                      <HashTableRow<T>
                        key={key}
                        keyValue={key}
                        item={item}
                        index={index}
                        columns={columns}
                        isLast={isLast}
                        onClick={onRowClick}
                        className={className}
                        animation={getRowAnimation(index, keys.length)}
                        additionalInfo={additionalInfo}
                        isAnimationsEnabled={isAnimationsEnabled}
                      />
                    );
                  })}
                </AnimatePresence>

                {columns.some((col) => col.last) && keys.length > 0 && (
                  <tr
                    className={clsx(
                      'hover:bg-darkGray-3 border-t-separator relative border-t-[0.5px]',
                      className?.row,
                      className?.lastRow,
                    )}>
                    {columns.map((column) => {
                      const lastKey = String(keys[keys.length - 1]);
                      const lastItem = data[lastKey] as T | undefined;

                      return (
                        <td key={column.key} className={clsx('px-4 py-3', className?.cell, column?.className)}>
                          {lastItem ? column.last?.(lastItem) : null}
                        </td>
                      );
                    })}
                  </tr>
                )}

                {!isDataRanedOut && keys.length > 0 && (
                  <>
                    <InView as="tr" className="relative -top-5" onChange={onView} />
                    <Skeletons
                      rowsCount={rowsCount}
                      columnsCount={columns.length}
                      className={{
                        row: className?.row,
                        cell: className?.cell,
                        firstRow: 'border-t-separator border-t-[0.5px]',
                      }}
                    />
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HashTable = memo(HashTableComponent) as typeof HashTableComponent;
