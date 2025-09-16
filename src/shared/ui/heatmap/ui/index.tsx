import { FC, useState } from 'react';
import clsx from 'clsx';
import { EventCallable, StoreWritable } from 'effector';
import { InView } from 'react-intersection-observer';
import { LoadedData } from 'shared/ui/loaded-data';
import { DAYS_IN_WEEK, MILLISECONDS_IN_ONE_DAY, MONTH_LABELS, WEEKDAY_LABELS } from './constants';
import { shiftDate, getBeginningTimeForDate, convertToDate } from './helpers';
import { Typography } from 'shared/ui/typography';
import { useUnit } from 'effector-react';
import { Skeleton } from 'shared/ui/skeleton';
import { formatter } from '../../../lib/formatter/index';

interface HeatmapProps {
  values: Array<{
    timestamp: number;
    volume: number;
  }> | null;
  className?: string;
  classForValue?: (count: number) => string;
  title?: string;
  onLoaded: EventCallable<void>;
  $isDataRanedOut: StoreWritable<boolean>;
  reachedEndOfList: EventCallable<void>;
}

const SQUARE_SIZE = 33;
const MONTH_LABEL_GUTTER_SIZE = 16;
const YEAR_LABEL_SIZE = 24;
const GUTTER_SIZE = 8;
const WEEKDAY_LABEL_SIZE = 40;
const WEEKDAY_LABEL_PADDING = 4;
export const Heatmap: FC<HeatmapProps> = ({
  values,
  className,
  classForValue = (volume) => {
    if (volume > 1000) return 'fill-[#34D399]';
    else if (volume > 100) return 'fill-[#2D8F71]';
    else if (volume > 0) return 'fill-[#23504A]';
    else return 'fill-[#2C3242]';
  },
  onLoaded,
  $isDataRanedOut,
  reachedEndOfList,
}) => {
  const [isDataRanedOut, reachEndOfList] = useUnit([$isDataRanedOut, reachedEndOfList]);
  const [hoveredSquare, setHoveredSquare] = useState<{
    x: number;
    y: number;
    volume: number;
    date: Date;
    id: string;
  } | null>(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const timestamps = values?.map((v) => v.timestamp).sort((a, b) => a - b) || [];
  const startTimestamp = timestamps[0];
  const endTimestamp = timestamps[timestamps.length - 1];
  console.log(JSON.stringify(values));

  const end = getBeginningTimeForDate(convertToDate(endTimestamp || 0));
  const start = getBeginningTimeForDate(convertToDate(startTimestamp || 0));

  const allDates: Date[] = [];
  let currentDate = new Date(end);

  while (currentDate >= start) {
    allDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() - 1);
  }

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  allDates.forEach((date, index) => {
    if (index === 0 || date.getDay() === 1) {
      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }
      currentWeek = [date];
    } else {
      currentWeek.push(date);
    }
  });

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const numWeeks = weeks.length;

  const squareSizeWithGutter = SQUARE_SIZE + GUTTER_SIZE;
  const monthLabelSize = SQUARE_SIZE + MONTH_LABEL_GUTTER_SIZE + YEAR_LABEL_SIZE;
  const weekdayLabelSize = WEEKDAY_LABEL_SIZE;

  const onView = (inView: boolean) => {
    if (inView && reachEndOfList) {
      reachEndOfList();
    }
  };
  const renderSquare = (dayIndex: number, weekIndex: number) => {
    if (weekIndex >= weeks.length || !weeks[weekIndex]) return null;
    if (dayIndex >= weeks[weekIndex].length) return null;

    const date = weeks[weekIndex][dayIndex];
    if (!date) return null;

    const dateString = date.toISOString().split('T')[0];

    const value = values?.find((v) => {
      const vDate = convertToDate(v.timestamp);
      const vDateString = vDate.toISOString().split('T')[0];
      return vDateString === dateString;
    });

    return (
      <g key={`square-${weekIndex}-${dayIndex}`}>
        <rect
          width={SQUARE_SIZE}
          height={SQUARE_SIZE}
          rx={6}
          x={weekIndex * squareSizeWithGutter}
          y={dayIndex * squareSizeWithGutter}
          className={clsx(
            'cursor-pointer rounded-sm transition-colors duration-200 ease-out',
            classForValue(value?.volume || 0),
          )}
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();

            if (rect.width > 0 && rect.height > 0) {
              const squareId = `square-${weekIndex}-${dayIndex}`;
              setHoveredSquare({
                x: rect.left + rect.width / 2,
                y: rect.top - 10,
                volume: value?.volume || 0,
                date: date,
                id: squareId,
              });
              setIsTooltipVisible(true);
            }
          }}
          onMouseLeave={() => {
            setIsTooltipVisible(false);
            setHoveredSquare(null);
          }}
        />
      </g>
    );
  };

  const renderSkeletonSquares = () => {
    return Array.from({ length: DAYS_IN_WEEK }, (_, dayIndex) =>
      Array.from({ length: 50 }, (_, weekIndex) => (
        <rect
          key={`skeleton-${weekIndex}-${dayIndex}`}
          width={SQUARE_SIZE}
          height={SQUARE_SIZE}
          rx={6}
          x={weekIndex * squareSizeWithGutter}
          y={dayIndex * squareSizeWithGutter}
          className="animate-pulse"
          fill="#2c3242"
        />
      )),
    );
  };

  const renderSkeletonWeek = (weekIndex: number) => (
    <g key={`skeleton-week-${weekIndex}`} className="heatmap-week">
      {Array.from({ length: DAYS_IN_WEEK }, (_, dayIndex) => (
        <rect
          key={`skeleton-${weekIndex}-${dayIndex}`}
          width={SQUARE_SIZE}
          height={SQUARE_SIZE}
          rx={6}
          x={weekIndex * squareSizeWithGutter}
          y={dayIndex * squareSizeWithGutter}
          className="animate-pulse"
          fill="#2c3242"
        />
      ))}
    </g>
  );

  const renderWeek = (weekIndex: number) => (
    <g key={weekIndex} className="heatmap-week">
      {Array.from({ length: weeks[weekIndex]?.length || 0 }, (_, dayIndex) => renderSquare(dayIndex, weekIndex))}
    </g>
  );

  const renderWeekdayLabels = () => {
    return Array.from({ length: DAYS_IN_WEEK }, (_, index) => {
      const yPosition = monthLabelSize + index * (SQUARE_SIZE + GUTTER_SIZE) + SQUARE_SIZE / 2;

      return (
        <text
          key={index}
          x={WEEKDAY_LABEL_SIZE - 8}
          y={yPosition}
          textAnchor="end"
          className="text-secondary fill-current text-[14px] font-medium">
          {WEEKDAY_LABELS[index]}
        </text>
      );
    });
  };

  const renderMonthLabels = () => {
    const monthData: { [key: string]: { month: string; weekIndex: number; x: number; date: Date } } = {};

    allDates.forEach((date, dateIndex) => {
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

      if (!monthData[monthKey]) {
        const weekIndex = Math.floor(dateIndex / 7);
        const monthIndex = date.getMonth();
        if (monthIndex >= 0 && monthIndex < MONTH_LABELS.length) {
          monthData[monthKey] = {
            month: MONTH_LABELS[monthIndex] || '',
            weekIndex,
            x: weekIndex * squareSizeWithGutter,
            date: new Date(date),
          };
        }
      }
    });

    const monthLabels = Object.values(monthData).sort((a, b) => b.date.getTime() - a.date.getTime());

    return monthLabels.map(({ month, x }, index) => (
      <text
        key={index}
        x={x}
        y={monthLabelSize - MONTH_LABEL_GUTTER_SIZE}
        className="text-secondary fill-current text-[14px] font-medium">
        {month || ''}
      </text>
    ));
  };

  const renderYearLabel = () => {
    const year = start.getFullYear();
    return (
      <text x={0} y={YEAR_LABEL_SIZE} className="text-secondary fill-current text-lg font-semibold">
        {year}
      </text>
    );
  };
  return (
    <div className={clsx('w-full', className)}>
      {onLoaded && <LoadedData loadedData={onLoaded} />}

      {values === null && (
        <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <svg
            width={50 * squareSizeWithGutter + weekdayLabelSize}
            height={DAYS_IN_WEEK * squareSizeWithGutter + monthLabelSize}
            viewBox={`0 0 ${50 * squareSizeWithGutter + weekdayLabelSize} ${DAYS_IN_WEEK * squareSizeWithGutter + monthLabelSize}`}
            style={{
              width: `${50 * squareSizeWithGutter + weekdayLabelSize}px`,
              height: `${DAYS_IN_WEEK * squareSizeWithGutter + monthLabelSize}px`,
            }}>
            <g transform={`translate(${weekdayLabelSize + MONTH_LABEL_GUTTER_SIZE}, 0)`}>
              {Array.from({ length: 49 }, (_, weekIndex) => (
                <rect
                  key={`skeleton-month-${weekIndex}`}
                  x={weekIndex * squareSizeWithGutter}
                  y={monthLabelSize - MONTH_LABEL_GUTTER_SIZE - 20}
                  width={20}
                  height={16}
                  className="animate-pulse"
                  fill="#2c3242"
                />
              ))}
            </g>
            <g transform={`translate(${weekdayLabelSize + MONTH_LABEL_GUTTER_SIZE}, ${monthLabelSize})`}>
              {Array.from({ length: 50 }, (_, weekIndex) => renderSkeletonWeek(weekIndex))}
            </g>
            <g transform={`translate(0, ${monthLabelSize})`}>{renderWeekdayLabels()}</g>
          </svg>
        </div>
      )}

      {values && values.length === 0 && <Typography color="secondary">No data available</Typography>}

      {values && values.length > 0 && (
        <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <svg
            width={numWeeks * squareSizeWithGutter + weekdayLabelSize + 20}
            height={Math.max(...weeks.map((week) => week.length)) * squareSizeWithGutter + monthLabelSize}
            viewBox={`0 0 ${numWeeks * squareSizeWithGutter + weekdayLabelSize + 20} ${Math.max(...weeks.map((week) => week.length)) * squareSizeWithGutter + monthLabelSize}`}
            style={{
              width: `${numWeeks * squareSizeWithGutter + weekdayLabelSize + 20}px`,
              height: `${Math.max(...weeks.map((week) => week.length)) * squareSizeWithGutter + monthLabelSize}px`,
            }}>
            <g transform={`translate(${weekdayLabelSize + MONTH_LABEL_GUTTER_SIZE}, 0)`}>
              {renderYearLabel()}
              {renderMonthLabels()}
            </g>
            <g transform={`translate(${weekdayLabelSize + MONTH_LABEL_GUTTER_SIZE}, ${monthLabelSize})`}>
              {Array.from({ length: numWeeks }, (_, weekIndex) => renderWeek(weekIndex))}
            </g>
            <g>{renderWeekdayLabels()}</g>
          </svg>

          {values && values.length > 0 && isDataRanedOut && (
            <InView
              as="div"
              delay={100}
              trackVisibility
              threshold={0.1}
              onChange={onView}
              rootMargin="100px"
              className="h-1 w-1"
              style={{
                position: 'absolute',
                left: `${numWeeks * squareSizeWithGutter + weekdayLabelSize + 50}px`,
                top: '50%',
              }}
            />
          )}
        </div>
      )}

      {hoveredSquare && (
        <div
          className={`border-separator bg-darkGray-3 pointer-events-none fixed z-50 flex flex-col items-start rounded-lg border px-3 py-2 shadow-xl backdrop-blur-sm transition-all duration-150 ease-out ${
            isTooltipVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-1 scale-95 opacity-0'
          }`}
          style={{
            left: Math.max(10, Math.min(window.innerWidth - 200, hoveredSquare.x)),
            top: Math.max(150, hoveredSquare.y - 40),
            transform: 'translateX(-50%)',
          }}>
          <Typography color="primary">Volume: {formatter.number.uiDefaultWithDollar(hoveredSquare.volume)}</Typography>
          <Typography>Date: {hoveredSquare.date.toLocaleDateString()}</Typography>
          <div className="border-separator bg-darkGray-3 absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 transform border-r border-b"></div>
        </div>
      )}
    </div>
  );
};
