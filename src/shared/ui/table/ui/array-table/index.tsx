import { JSX, ReactNode, useCallback, memo } from 'react';
import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { InView } from 'react-intersection-observer';
import { EventCallable, StoreWritable } from 'effector';
import { LoadedData } from 'shared/ui/loaded-data';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { animations } from 'shared/config/animations';
import { TableFallback, Skeletons } from '../components';

export interface Column<T> {
  key: string;
  title?: string | ReactNode;
  render?: (item: T, additionalInfo?: Record<any, any>, isLastRow?: boolean) => ReactNode;
  className?: string;
  last?: (item: T) => ReactNode;
  isNotOnClick?: boolean;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[] | null;
  animation?: {
    default?: Variants;
    first?: Variants;
    last?: Variants;
  };
  showAnimation?: boolean;
  onRowClick?: (item: T) => void;
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
    noData?: string;
  };
  rowsCount?: number;
  reachedEndOfList: EventCallable<void>;
  noData?: JSX.Element;
  uniqueKey?: keyof T | ((item: T) => string | number);
  $isDataRanedOut: StoreWritable<boolean>;
  onLoaded?: EventCallable<void>;
  additionalInfo?: Record<any, any>;
  isAnimationsEnabled?: boolean;
}

interface RowProps<T> {
  item: T;
  columns: Column<T>[];
  isLast: boolean;
  isFirst: boolean;
  onClick?: (item: T) => void;
  className?: TableProps<T>['className'];
  animation?: Variants;
  isAnimationsEnabled: boolean;
  additionalInfo?: Record<any, any>;
}

const RowComponent = <T extends unknown>({
  item,
  columns,
  isLast,
  isFirst,
  onClick,
  className,
  animation,
  additionalInfo,
  isAnimationsEnabled,
}: RowProps<T>) => {
  return (
    <motion.tr
      initial="initial"
      animate="animate"
      exit="exit"
      variants={isAnimationsEnabled ? animation : undefined}
      transition={{ duration: 0.5 }}
      className={clsx(
        'hover:!bg-darkGray-3 group relative',
        {
          'border-b-separator border-b-[0.5px]': !isLast,
          'first-item': isFirst,
        },
        className?.row,
      )}>
      {columns.map((column) => (
        <td
          key={column.key}
          className={clsx('px-4 py-3', className?.cell, column?.className)}
          onClick={() => (column.isNotOnClick ? null : onClick?.(item))}>
          {column.render ? column.render(item, additionalInfo, isLast) : (item[column.key as keyof T] as ReactNode)}
        </td>
      ))}
      {isAnimationsEnabled && animation === animations.table.flashAndShake && (
        <motion.div
          className="absolute inset-0 z-[-1] rounded-xl"
          variants={{
            initial: { opacity: 0 },
            animate: {
              backgroundColor: ['rgba(251, 191, 36, 0)', 'rgba(251, 191, 36, 0.6)', 'rgba(251, 191, 36, 0)'],
              opacity: [0, 1, 0],
              transition: {
                duration: 0.8,
                times: [0, 0.3, 0.9],
                ease: 'easeInOut',
              },
            },
          }}
          initial="initial"
          animate="animate"
        />
      )}
    </motion.tr>
  );
};

const Row = memo(RowComponent) as typeof RowComponent;

const TableComponent = <T extends unknown>({
  columns,
  data,
  onRowClick,
  isOnce = true,
  className,
  reachedEndOfList,
  $isDataRanedOut,
  rowsCount = 10,
  isAnimationsEnabled = false,
  onLoaded,
  uniqueKey,
  showAnimation,
  animation,
  additionalInfo,
  noData,
}: TableProps<T>) => {
  const reachEndOfList = useUnit(reachedEndOfList);
  const isDataRanedOut = useUnit($isDataRanedOut);

  const onView = (inView: boolean) => {
    if (inView) reachEndOfList();
  };

  const getItemKey = useCallback(
    (item: T, index: number): string | number => {
      if (!uniqueKey) return index;

      if (typeof uniqueKey === 'function') {
        return uniqueKey(item);
      }

      const value = item[uniqueKey];
      return typeof value === 'string' || typeof value === 'number' ? value : index;
    },
    [uniqueKey],
  );

  const getRowAnimation = (index: number, length: number): Variants => {
    if (index === 0) return animation?.first || animations.table.flashAndShake;
    if (index === length - 1) return animation?.last || animations.table.flash.last;
    return animation?.default || animations.table.flash.default;
  };

  if (data === null) {
    return (
      <>
        {onLoaded && <LoadedData isOnce={isOnce} loadedData={onLoaded} />}
        <TableFallback columnsCount={columns.length} rowsCount={rowsCount} className={className} />
      </>
    );
  }

  if (data.length === 0)
    return (
      <div
        className={clsx(
          'bg-darkGray-1 min-h-[400px] w-full overflow-hidden rounded-xl',
          className?.wrapper,
          className?.noData,
        )}>
        {noData}
      </div>
    );

  return (
    <div className={clsx('bg-darkGray-1 w-full overflow-hidden rounded-xl', className?.wrapper)}>
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
                  {data.map((item, index) => {
                    const isLast = index === data.length - 1;
                    const isFirst = index === 0 && Boolean(showAnimation);
                    const key = getItemKey(item, index);
                    const rowAnimation = getRowAnimation(index, data.length);

                    return (
                      <Row<T>
                        key={key}
                        item={item}
                        isFirst={isFirst}
                        isAnimationsEnabled={isAnimationsEnabled}
                        columns={columns}
                        isLast={isLast}
                        onClick={onRowClick}
                        className={className}
                        animation={rowAnimation}
                        additionalInfo={additionalInfo}
                      />
                    );
                  })}
                </AnimatePresence>

                {columns.some((col) => col.last) && (
                  <tr
                    className={clsx(
                      'hover:bg-darkGray-3 border-t-separator relative border-t-[0.5px]',
                      className?.row,
                      className?.lastRow,
                    )}>
                    {columns.map((column) => (
                      <td key={column.key} className={clsx('px-4 py-3', className?.cell, column?.className)}>
                        {column.last?.(data[data.length - 1] as T)}
                      </td>
                    ))}
                  </tr>
                )}

                {!isDataRanedOut && data.length > 0 && (
                  <>
                    <InView as="tr" className="relative -top-5" onChange={onView} />
                    <Skeletons
                      rowsCount={rowsCount}
                      columnsCount={columns.length}
                      className={{
                        row: clsx('hover:bg-darkGray-3', className?.row),
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

export const Table = memo(TableComponent) as typeof TableComponent;
