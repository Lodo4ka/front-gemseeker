import { infer as types } from 'zod';
import { contracts } from 'shared/api/contracts';
import { StoreWritable } from 'effector';

export type Thread = types<typeof contracts.thread.single>;

export type ThreadObject = Record<number, Record<number, Thread>>;

export type ThreadIds = number[] | null;

export type ThreadIdsStore = StoreWritable<ThreadIds>;
