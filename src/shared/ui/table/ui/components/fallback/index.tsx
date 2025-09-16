import clsx from 'clsx';
import { FC } from 'react';
import { Skeleton } from 'shared/ui/skeleton';
import { Skeletons } from '../skeletons';

interface TableFallbackProps {
  rowsCount?: number;
  columnsCount?: number;
  className?: {
    wrapper?: string;
    container?: string;
    table?: string;
    header?: string;
    headerCell?: string;
    body?: string;
    row?: string;
    cell?: string;
  };
}

export const TableFallback: FC<TableFallbackProps> = ({ rowsCount = 5, columnsCount = 4, className }) => {
  return (
    <div
      className={clsx(
        'w-full overflow-auto',
        '[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2',
        '[&::-webkit-scrollbar-thumb]:rounded-full',
        'rotate-x-180',
        '[&::-webkit-scrollbar-thumb]:bg-darkGray-3',
        '[&::-webkit-scrollbar-track]:rounded-full',
        '[&::-webkit-scrollbar-track]:bg-darkGray-1',
        'scrollbar-thin scrollbar-thumb-darkGray-3 scrollbar-track-darkGray-1',
      )}>
      <div className={clsx('w-fit min-w-full rotate-x-180', className?.container)}>
        <div className={clsx('bg-darkGray-1 overflow-hidden rounded-xl', className?.wrapper)}>
          <table className={clsx('w-full', className?.table)}>
            <thead className={clsx('border-b-separator border-b-[0.5px]', className?.header)}>
              <tr>
                {Array(columnsCount)
                  .fill(null)
                  .map((_, index) => (
                    <th
                      key={index}
                      className={clsx(
                        'px-4 py-[10px] text-left whitespace-nowrap',
                        'text-secondary text-sm font-normal',
                        className?.headerCell,
                      )}>
                      <Skeleton isLoading className="h-5 w-24" />
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className={clsx(className?.body)}>
              <Skeletons
                rowsCount={rowsCount}
                columnsCount={columnsCount}
                className={{ row: className?.row, cell: className?.cell }}
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
