import { combine, createEffect, createEvent, createStore, sample } from 'effector';
import { api } from 'shared/api';

import { Donation, Stream, StreamInfo } from '../types';
import { createLocalTracks, LocalAudioTrack, LocalVideoTrack, Track } from '@dtelecom/livekit-client';
import { $isCameraEnabledLivekit, $isMicrophoneEnabledLivekit, $isScreenShareEnabledLivekit } from './devices';
import { $tasks } from './tasks';
import { $viewer } from 'shared/viewer';
import { invoke } from '@withease/factories';

const join = invoke(api.mutations.stream.join);
const wsUrl = invoke(api.queries.streams.wsUrl);
const info = invoke(api.queries.streams.info);

export const $stream = createStore<Stream | null>(null);
export const $isHost = createStore<boolean>(false);
export const $isActiveStream = combine($stream, (stream) => Boolean(stream));
export const $slug = createStore<string | null>(null);
export const $streamInfo = createStore<StreamInfo | null>(null);
export const $isDonateAllowed = combine($streamInfo, $viewer, (streamInfo, user) => {
  if (!streamInfo) return false;
  if (streamInfo.creator.user_id === user?.user_id) return false;
  return true;
});
export const $isTokenCreationAllowed = combine($streamInfo, $viewer, (streamInfo, user) => {
  if (!streamInfo || !user) return false;
  if (streamInfo.stream_tokens.length != 0) return false;
  if (streamInfo.creator.user_id != user.user_id) return false;
  return true;
});

export const $videoTrack = createStore<LocalVideoTrack | null>(null);
export const $screenTrack = createStore<MediaStreamTrack | null>(null);
export const $volume = createStore<number>(0);
export const $isMuted = createStore<boolean>(false);
export const toggledMuted = createEvent();
export const changedVolume = createEvent<number>();
export const $microphoneTrack = createStore<LocalAudioTrack | null>(null);
export const $donations = createStore<Donation[] | null>(null);
export const $isAccordionOpen = createStore<boolean>(true);
export const toggledAccordionOpen = createEvent();

export const fetchLocalVideoTracks = createEffect(async () => {
  const tracks = await createLocalTracks({ video: true });
  const camTrack = tracks.find((t) => t.kind === Track.Kind.Video);
  return (camTrack as LocalVideoTrack) ?? null;
});

export const fetchLocalMicrophoneTracks = createEffect(async () => {
  const tracks = await createLocalTracks({ audio: true });
  const micTrack = tracks.find((t) => t.kind === Track.Kind.Audio);
  return (micTrack as LocalAudioTrack) ?? null;
});

export const fetchScreenShareTracks = createEffect(async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const [screenTrack] = stream.getVideoTracks();
    return screenTrack ?? null;
  } catch (error) {
    console.error('Ошибка при старте демонстрации экрана:', error);
    throw error;
  }
});

sample({
  clock: api.queries.streams.donations.finished.success,
  source: $donations,
  fn: (donations, { result }) => {
    if (donations === null) return result;

    return [...donations, ...result];
  },
  target: $donations,
});

sample({
  clock: toggledAccordionOpen,
  source: $isAccordionOpen,
  fn: (isOpen) => !isOpen,
  target: $isAccordionOpen,
});

sample({
  clock: toggledMuted,
  source: $isMuted,
  fn: (isMuted) => !isMuted,
  target: $isMuted,
});

sample({
  clock: $volume,
  source: $isMuted,
  filter: (isMuted) => !isMuted,
  fn: (_, volume) => volume === 0,
  target: $isMuted,
});

sample({
  clock: $isMuted,
  filter: Boolean,
  fn: (_) => 0,
  target: $volume,
});

sample({
  clock: $isMuted,
  filter: (isMuted) => !isMuted,
  fn: (_) => 1,
  target: $volume,
});

sample({
  clock: changedVolume,
  target: $volume,
});

sample({
  clock: $volume,
  fn: (volume) => volume === 0,
  target: $isMuted,
});

sample({
  clock: api.queries.token.single.finished.success,
  fn: ({ result }) => result.slug,
  target: $slug,
});

sample({
  clock: info.finished.success,
  fn: ({ result }) => result,
  target: $streamInfo,
});

sample({
  clock: $slug,
  filter: Boolean,
  target: [info.start, wsUrl.start, api.queries.streams.tasks.start],
});

sample({
  clock: wsUrl.finished.success,
  fn: ({ result, params }) => ({ ws_url: result, slug: params }),
  target: join.start,
});
sample({
  clock: join.finished.success,
  fn: ({ result }) => result,
  target: $stream,
});

sample({
  clock: api.sockets.stream.donationRawReceived,
  source: {
    donations: $donations,
    slug: $slug,
  },
  filter: ({ slug }, { info }) => slug === info.slug,
  fn: ({ donations }, { donation }) => {
    if (donations === null) return [donation as Donation];

    return [donation as Donation, ...donations];
  },
  target: $donations,
});

sample({
  clock: [api.sockets.stream.donationRawReceived, api.sockets.stream.viewerChangedRawReceived],
  source: {
    slug: $slug,
    streamInfo: $streamInfo,
  },
  filter: ({ slug }, { info }) => slug === info.slug,
  fn: ({ streamInfo }, { info }) => ({
    slug: info.slug,
    name: info.name,
    creator: {
      user_id: info.creator.user_id,
      user_nickname: info.creator.user_nickname,
      user_photo_hash: info.creator.user_photo_hash,
      subscribers: streamInfo?.creator?.subscribers ?? 0,
      subscribed: streamInfo?.creator?.subscribed ?? false,
    },
    created_at: info.created_at,
    viewers: info.viewers,
    preview_photo: info.preview_photo,
    stream_tokens: info.stream_tokens,
    donation_sum: info.donation_sum,
    finished: streamInfo?.finished ?? false,
    is_nsfw: info.is_nsfw,
  }),
  target: $streamInfo,
});
sample({
  clock: $stream,
  filter: Boolean,
  fn: ({ is_creator }) => is_creator,
  target: $isHost,
});

sample({
  clock: $isCameraEnabledLivekit,
  source: $videoTrack,
  filter: (videoTrack, isCameraEnabled) => Boolean(videoTrack && !isCameraEnabled),
  fn: (videoTrack) => {
    videoTrack?.mediaStreamTrack.stop();
    return videoTrack;
  },
  target: $videoTrack,
});

sample({
  clock: $isMicrophoneEnabledLivekit,
  source: $microphoneTrack,
  filter: (microphoneTrack, isMicrophoneEnabled) => Boolean(microphoneTrack && !isMicrophoneEnabled),
  fn: (microphoneTrack) => {
    microphoneTrack?.mediaStreamTrack.stop();
    return microphoneTrack;
  },
  target: $microphoneTrack,
});

sample({
  clock: api.sockets.stream.finishedRawReceived,
  source: $streamInfo,
  filter: (prev, { info }) => prev?.slug === info.slug,
  fn: (prev, { info }) => ({
    finished: true,
    creator: {
      user_id: info.creator.user_id,
      user_nickname: info.creator.user_nickname,
      user_photo_hash: info.creator.user_photo_hash,
      subscribers: prev?.creator?.subscribers ?? 0,
      subscribed: prev?.creator?.subscribed ?? false,
    },
    created_at: info.created_at,
    viewers: info.viewers,
    name: info.name,
    slug: info.slug,
    preview_photo: info.preview_photo,
    stream_tokens: info.stream_tokens,
    donation_sum: info.donation_sum,
    is_nsfw: info.is_nsfw,
  }),
  target: $streamInfo,
});

sample({
  clock: api.mutations.stream.delete.finished.success,
  target: [
    $stream.reinit,
    $streamInfo.reinit,
    $slug.reinit,
    $isHost.reinit,
    $videoTrack.reinit,
    $screenTrack.reinit,
    $microphoneTrack.reinit,
    $tasks.reinit,
    $isAccordionOpen.reinit,
  ],
});

sample({
  clock: fetchLocalVideoTracks.doneData,
  filter: Boolean,
  fn: (track) => track,
  target: $videoTrack,
});

sample({
  clock: $isCameraEnabledLivekit,
  filter: Boolean,
  target: fetchLocalVideoTracks,
});

sample({
  clock: fetchLocalMicrophoneTracks.doneData,
  filter: Boolean,
  fn: (track) => track,
  target: $microphoneTrack,
});

sample({
  clock: $isMicrophoneEnabledLivekit,
  filter: Boolean,
  target: fetchLocalMicrophoneTracks,
});

sample({
  clock: fetchScreenShareTracks.doneData,
  filter: Boolean,
  fn: (track) => track,
  target: $screenTrack,
});

sample({
  clock: fetchScreenShareTracks.doneData,
  fn: () => true,
  target: $isScreenShareEnabledLivekit,
});

sample({
  clock: fetchScreenShareTracks.failData,
  fn: () => false,
  target: $isScreenShareEnabledLivekit,
});
