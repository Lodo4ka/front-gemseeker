import { api } from 'shared/api';
import { infer as types } from 'zod';

export type StreamCreatedMessage = types<typeof api.contracts.stream.created>;
export type StreamFinishedMessage = types<typeof api.contracts.stream.finished>;
export type DonationMessage = types<typeof api.contracts.stream.donation>;
export type ViewerChangeMessage = types<typeof api.contracts.stream.viewer>;

export type StreamMessage = StreamCreatedMessage | StreamFinishedMessage | DonationMessage | ViewerChangeMessage;
