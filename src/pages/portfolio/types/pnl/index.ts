import {
  AreaSeriesOptions,
  AreaStyleOptions,
  AreaData,
  DeepPartial,
  WhitespaceData,
  ISeriesApi,
  Time,
  SeriesOptionsCommon,
} from 'lightweight-charts';

export type Tooltip = {
  display: boolean;
  pnl: number;
  sol_value: number;
  percentage: number;
  x: number;
  y: number;
};

export type Series = ISeriesApi<
  'Area',
  Time,
  AreaData<Time> | WhitespaceData<Time>,
  AreaSeriesOptions,
  DeepPartial<AreaStyleOptions & SeriesOptionsCommon>
>;

export type PNL_Dot = { time: Time; value: number };
