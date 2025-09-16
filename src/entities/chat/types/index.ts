import { infer as types } from 'zod';
import { contracts } from 'shared/api/contracts';
import { StoreWritable } from 'effector';

export type Message = types<typeof contracts.chat.message>;

export type MessageObject = Record<string, Record<number, Message>>;

export type MessagesIds = (number | string)[] | null;

export type MessagesIdsStore = StoreWritable<MessagesIds>;
