import { infer as types } from 'zod';
import { api } from 'shared/api';
import { contracts } from 'shared/client';
import { Store, StoreWritable } from 'effector';

export type Stream = types<typeof api.contracts.stream.join>;

export type StreamInfo = types<typeof api.contracts.stream.info>;

export type Task = types<typeof api.contracts.stream.task>;

export type TaskType = 'donation' | 'mcap';

export type Donation = types<typeof api.contracts.stream.donate>;
export type StreamListItem = types<typeof contracts.RoomListResponse>;
export type StreamResponseWSum = types<typeof contracts.RoomResponseWSum>;
export type AllStreams = Record<string, StreamListItem>;
export type StreamsIds = string[] | null;
export type StreamIdsStore = StoreWritable<StreamsIds> | Store<StreamsIds>;
export type Token = types<typeof contracts.SPLTokenResponse>;
export type StreamDeleted = {
  slug: string;
  type: 'STREAM_FINISHED';
};

export type StreamCreated = {
  info: StreamListItem;
  type: 'STREAM_CREATED';
};
