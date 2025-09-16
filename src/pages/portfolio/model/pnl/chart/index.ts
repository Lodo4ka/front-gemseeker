import { attach, combine, createEffect, createEvent, createStore, sample } from 'effector';
import { createSeriesOptions, createChartOptions, initialTooltip, tooltipSizes } from '../../../config/pnl';
import { Series, Tooltip } from '../../../types/pnl';
import { AreaData, AreaSeries, createChart, LineData, MouseEventParams, Time } from 'lightweight-charts';
import { $pnl } from 'entities/user';

export type PnlDot = {
  value: number;
  time: Time;
  percentage: number;
  sol_value: number;
};

export const $tooltip = createStore<Tooltip>(initialTooltip);

export const $element = createStore<HTMLElement | null>(document.getElementById('pnl'));
export const $chart = createStore<ReturnType<typeof createChart> | null>(null);
export const $series = createStore<Series | null>(null);
export const initChart = createEvent<HTMLElement | null>();
const windowResized = createEvent();
const mouseMoved = createEvent<MouseEventParams<Time>>();

export const subscribeChartResizeFx = createEffect(() => {
  window.addEventListener('resize', () => windowResized());
});

const subscribeMouseMoveFx = attach({
  source: $chart,
  effect: (chart) => {
    if (!chart) return;
    chart.subscribeCrosshairMove(mouseMoved);
  },
});

export const resizeChartFx = attach({
  source: {
    chart: $chart,
    element: $element,
  },
  effect: ({ chart, element }) => {
    if (!chart || !element) return;
    chart.resize(element.clientWidth, element.clientHeight);
  },
});

sample({
  clock: $element,
  filter: Boolean,
  fn: (element) => {
    element.innerHTML = '';

    return createChart(element, createChartOptions(element));
  },
  target: $chart,
});

sample({
  clock: $chart,
  source: $pnl,
  filter: Boolean,
  fn: (data, chart) => {
    if (!chart) return null;
    const series = chart.addSeries(AreaSeries, createSeriesOptions);
    series.setData(data.pnl_by_days as unknown as AreaData<Time>[]);
    chart.timeScale().fitContent();
    return series;
  },
  target: $series,
});

sample({
  clock: $pnl,
  source: combine($chart, $series, (chart, series) => (chart && series ? { chart, series } : null)),
  filter: Boolean,
  fn: ({ chart, series }, data) => {
    if (data) series.setData(data.pnl_by_days as unknown as AreaData<Time>[]);
    chart.timeScale().fitContent();
  },
});

sample({
  clock: windowResized,
  target: resizeChartFx,
});
sample({
  clock: initChart,
  target: [subscribeChartResizeFx, subscribeMouseMoveFx, $element],
});

sample({
  clock: mouseMoved,
  source: combine(
    {
      element: $element,
      tooltip: $tooltip,
      series: $series,
    },
    ({ element, tooltip, series }) =>
      element === null || series === null
        ? null
        : {
            element,
            tooltip,
            series,
          },
  ),
  filter: Boolean,
  fn: ({ element, tooltip, series }, { point, time, seriesData }) => {
    if (
      !point ||
      !time ||
      point.x < 0 ||
      point.x > element.clientWidth ||
      point.y <= 0 ||
      point.y > element.clientHeight
    )
      return { ...tooltip, display: false };

    const currentPoint: LineData<PnlDot> = seriesData.get(series) as unknown as LineData<PnlDot>;
    let x = point.x + tooltipSizes.margin;
    if (x > element.clientWidth - tooltipSizes.width) x = point.x - tooltipSizes.margin - tooltipSizes.width;

    let y = point.y + tooltipSizes.margin;
    if (y > element.clientHeight - tooltipSizes.height) y = point.y - tooltipSizes.height - tooltipSizes.margin;

    return {
      display: true,
      pnl: currentPoint.value,
      x,
      y,
      sol_value: (currentPoint.customValues?.sol_value as number) ?? 0,
      percentage: (currentPoint.customValues?.percentage as number) ?? 0,
    };
  },
  target: $tooltip,
});
