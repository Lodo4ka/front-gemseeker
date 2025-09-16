import clsx from 'clsx';
import { Skeleton } from 'shared/ui/skeleton';

interface SkeletonsProps {
  rowsCount: number;
  columnsCount: number;

  className: {
    row?: string;
    cell?: string;
    firstRow?: string;
  };
}
export const Skeletons = ({ rowsCount, columnsCount, className }: SkeletonsProps) => {
  return Array(rowsCount)
    .fill(null)
    .map((_, rowIndex) => (
      <tr
        key={rowIndex}
        className={clsx(
          { 'border-b-separator border-b-[0.5px]': rowIndex !== rowsCount - 1 },
          { [className?.firstRow || '']: rowIndex === 0 },
          className?.row,
        )}>
        {Array(columnsCount)
          .fill(null)
          .map((_, colIndex) => (
            <td key={colIndex} className={clsx('px-4 py-3', className?.cell)}>
              <Skeleton isLoading className="h-5 w-full" />
            </td>
          ))}
      </tr>
    ));
};
