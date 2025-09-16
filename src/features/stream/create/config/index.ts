import { object, string, array } from 'zod';

export const CREATE_STREAM_MODAL = 'CREATE_STREAM_MODAL';

export const formSchema = object({
  name: string().min(5, 'Name must be at least 5 characters long'),
  tasks: array(
    object({
      title: string().min(5, 'Title must be at least 5 characters long'),
      target: string()
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val > 0, {
          message: 'Target must be a number greater than 0',
        }),
    }),
  ).max(5, 'You can only add up to 5 tasks'),
});
