import { array, number, object } from 'zod';

export const pnlInfo = object({
  invested: number(),
  invested_sol: number(),
  pnl: number(),
  pnl_percentage: number(),
  pnl_sol: number(),
  realised_pnl: number(),
  realised_pnl_sol: number(),
  revenue: number(),
  revenue_sol: number(),
  sold: number(),
  sold_sol: number(),
  spent: number(),
  spent_sol: number(),
  unrealised_pnl: number(),
  unrealised_pnl_sol: number(),
});

export const pnl = object({
  pnl_by_days: array(
    object({
      time: number(),
      value: number(),
      customValues: object({
        percentage: number(),
        sol_value: number(),
      }),
    }),
  ),
  whole_pnl: pnlInfo,
});
