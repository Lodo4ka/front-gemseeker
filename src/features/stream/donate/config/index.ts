import { object, string } from 'zod';

export const DONATE_MODAL = 'DONATE_MODAL';

export const formSchema = object({
  amount: string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'Amount must be a number greater than 0',
    }),
});
