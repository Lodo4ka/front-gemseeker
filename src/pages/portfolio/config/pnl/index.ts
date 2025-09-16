import { DeepPartial, LineStyle, AreaStyleOptions, SeriesOptionsCommon, UTCTimestamp } from 'lightweight-charts';
import { ChartOptions } from 'lightweight-charts';
import { Tooltip } from '../../types/pnl';

export const createChartOptions = (element: HTMLElement): DeepPartial<ChartOptions> => {
  return {
    width: element.clientWidth,
    height: element.clientHeight,
    rightPriceScale: {
      alignLabels: false,
      borderVisible: false,
      minimumWidth: 36,
      scaleMargins: {
        top: 0.1,
        bottom: 0.053,
      },
      textColor: '#7D8497',
    },
    handleScroll: false,
    handleScale: {
      pinch: true,

      axisPressedMouseMove: true,
      mouseWheel: false,
    },
    localization: {
      locale: 'en',
      dateFormat: "dd MMM 'yy",
    },
    layout: {
      background: { color: '#1A1E28' },
      textColor: '#7D8497',
      fontSize: 14,
      fontFamily: 'Inter',
    },
    timeScale: {
      minimumHeight: 28,
      borderVisible: false,
      rightOffset: 0,
      shiftVisibleRangeOnNewBar: false,
      allowShiftVisibleRangeOnWhitespaceReplacement: false,
      tickMarkFormatter: (time: UTCTimestamp) => {
        const date = new Date((time as UTCTimestamp) * 1000);
        return date.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
        });
      },
    },
    crosshair: {
      mode: 0,
      vertLine: {
        style: LineStyle.Solid,
        labelVisible: false,
        color: '#ffffff33',
      },
      horzLine: {
        visible: false,
        labelVisible: false,
      },
    },
    grid: {
      vertLines: { visible: false },
      horzLines: { visible: false },
    },
  };
};

export const createSeriesOptions: DeepPartial<AreaStyleOptions & SeriesOptionsCommon> = {
  lineColor: '#34D399',
  lineWidth: 1,
  lastValueVisible: false,
  priceLineVisible: false,
};

export const initialTooltip: Tooltip = {
  display: false,
  pnl: 0,
  sol_value: 0,
  percentage: 0,
  x: 0,
  y: 0,
};

export const tooltipSizes = {
  width: 106,
  height: 72,
  margin: 10,
};

export const timeframesUi = {
  '1': 1,
  '1w': 7,
  '1m': 30,
  '3m': 90,
  '1y': 365,
} as const;

export const timeframes = {
  1: '1d',
  7: '1w',
  30: '1m',
  90: '3m',
  365: '1y',
} as const;
