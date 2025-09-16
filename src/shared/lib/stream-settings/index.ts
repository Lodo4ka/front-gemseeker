import { createLocalTracks, LocalAudioTrack, Track } from '@dtelecom/livekit-client';
import { LocalVideoTrack } from '@dtelecom/livekit-client';
import { createFactory } from '@withease/factories';
import { attach, createEffect, createEvent, createStore, Event, EventCallable, sample } from 'effector';
import { spread } from 'patronum';

export const streamSettingsFactory = createFactory(
  ({ fetchDevicesEvent }: { fetchDevicesEvent: EventCallable<unknown>[] | Event<unknown>[] }) => {
    const $currentCameraId = createStore<string | null>(null);
    const selectedCamera = createEvent<MediaDeviceInfo>();
    const $isMicrophoneEnabled = createStore(false);
    const $isCameraEnabled = createStore(false);

    const toggledCameraEnabled = createEvent();
    const toggledMicrophoneEnabled = createEvent();

    const $currentMicrophoneId = createStore<string | null>(null);
    const selectedMicrophone = createEvent<MediaDeviceInfo>();

    const $cameras = createStore<MediaDeviceInfo[]>([]);
    const $microphones = createStore<MediaDeviceInfo[]>([]);

    const $stream = createStore<MediaStream | null>(null);

    const fetchDevicesFx = createEffect(async () => {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      return {
        cameras: devices.filter((d) => d.kind === 'videoinput'),
        microphones: devices.filter((d) => d.kind === 'audioinput'),
      };
    });

    const getStreamFx = attach({
      source: {
        cameraId: $currentCameraId,
        isCameraEnabled: $isCameraEnabled,
      },
      async effect({ cameraId, isCameraEnabled }) {
        if (!cameraId) return null;
        return await navigator.mediaDevices.getUserMedia({
          video: isCameraEnabled ? { deviceId: { exact: cameraId } } : false,
          audio: false,
        });
      },
    });

    sample({
      clock: $isCameraEnabled,
      source: $stream,
      filter: (stream, isEnabled) => !!stream && !isEnabled,
      fn: (stream) => {
        stream?.getVideoTracks().forEach((track) => track.stop());
        return null;
      },
      target: $stream,
    });

    sample({
      clock: toggledCameraEnabled,
      source: $isCameraEnabled,
      fn: (state) => !state,
      target: $isCameraEnabled,
    });

    sample({
      clock: toggledMicrophoneEnabled,
      source: $isMicrophoneEnabled,
      fn: (state) => !state,
      target: $isMicrophoneEnabled,
    });

    sample({
      clock: fetchDevicesFx.doneData,
      source: {
        currentCameraId: $currentCameraId,
        currentMicrophoneId: $currentMicrophoneId,
      },
      fn: ({ currentCameraId, currentMicrophoneId }, { cameras, microphones }) => ({
        camera: cameras.find((c) => c.deviceId === currentCameraId)?.deviceId ?? cameras[0]?.deviceId,
        microphone: microphones.find((m) => m.deviceId === currentMicrophoneId)?.deviceId ?? microphones[0]?.deviceId,
      }),
      target: spread({
        camera: $currentCameraId,
        microphone: $currentMicrophoneId,
      }),
    });

    sample({
      clock: fetchDevicesFx.doneData,
      source: $currentCameraId,
      target: getStreamFx,
    });

    sample({
      clock: getStreamFx.doneData,
      target: $stream,
    });

    sample({
      clock: selectedCamera,
      fn: (device) => device.deviceId,
      target: $currentCameraId,
    });
    sample({
      clock: selectedMicrophone,
      fn: (device) => device.deviceId,
      target: $currentMicrophoneId,
    });

    sample({
      clock: fetchDevicesFx.doneData,
      target: spread({
        cameras: $cameras,
        microphones: $microphones,
      }),
    });

    sample({
      clock: [...fetchDevicesEvent],
      target: fetchDevicesFx,
    });

    sample({
      clock: [toggledCameraEnabled, toggledMicrophoneEnabled],
      filter: Boolean,
      target: fetchDevicesFx,
    });

    return {
      $currentCameraId,
      $cameras,
      $currentMicrophoneId,
      $microphones,
      $stream,
      selectedCamera,
      selectedMicrophone,
      $isMicrophoneEnabled,
      $isCameraEnabled,
      toggledCameraEnabled,
      toggledMicrophoneEnabled,
    };
  },
);

export const streamSettingsFactory2 = createFactory(
  ({
    fetchVideoTracksEvent,
    fetchMicrophoneTracksEvent,
  }: {
    fetchVideoTracksEvent: EventCallable<unknown>[] | Event<unknown>[];
    fetchMicrophoneTracksEvent: EventCallable<unknown>[] | Event<unknown>[];
  }) => {
    const $currentCamera = createStore<MediaDeviceInfo | null>(null);
    const selectedCamera = createEvent<MediaDeviceInfo>();
    const $isMicrophoneEnabled = createStore(false);
    const $isCameraEnabled = createStore(false);

    const toggledCameraEnabled = createEvent();
    const toggledMicrophoneEnabled = createEvent();

    const $currentMicrophone = createStore<MediaDeviceInfo | null>(null);
    const selectedMicrophone = createEvent<MediaDeviceInfo>();

    const $videoTracks = createStore<LocalVideoTrack[]>([]);
    const $audioTracks = createStore<LocalAudioTrack[]>([]);

    const $currentVideoTrack = createStore<LocalVideoTrack | null>(null);
    const $currentMicrophoneTrack = createStore<LocalAudioTrack | null>(null);

    const fetchVideoTracksFx = createEffect(async () => {
      return await createLocalTracks({ video: true });
    });

    const fetchMicrophoneTracksFx = createEffect(async () => {
      return await createLocalTracks({ audio: true });
    });

    sample({
      clock: toggledCameraEnabled,
      source: $isCameraEnabled,
      fn: (state) => !state,
      target: $isCameraEnabled,
    });

    sample({
      clock: toggledMicrophoneEnabled,
      source: $isMicrophoneEnabled,
      fn: (state) => !state,
      target: $isMicrophoneEnabled,
    });
    sample({
      clock: selectedCamera,
      target: $currentCamera,
    });
    sample({
      clock: selectedMicrophone,
      target: $currentMicrophone,
    });

    sample({
      clock: fetchMicrophoneTracksEvent,
      target: fetchMicrophoneTracksFx,
    });

    sample({
      clock: fetchVideoTracksEvent,
      target: fetchVideoTracksFx,
    });

    sample({
      clock: toggledCameraEnabled,
      source: $isCameraEnabled,
      filter: Boolean,
      target: fetchVideoTracksFx,
    });

    sample({
      clock: fetchVideoTracksFx.doneData,
      fn: (tracks) => tracks.filter((t) => t.kind === Track.Kind.Video) as LocalVideoTrack[],
      target: $videoTracks,
    });

    sample({
      clock: fetchMicrophoneTracksFx.doneData,
      fn: (tracks) => tracks.filter((t) => t.kind === Track.Kind.Audio) as LocalAudioTrack[],
      target: $audioTracks,
    });

    sample({
      clock: toggledMicrophoneEnabled,
      source: $isMicrophoneEnabled,
      filter: Boolean,
      target: fetchMicrophoneTracksFx,
    });

    return {
      $currentCamera,
      $currentMicrophone,
      $videoTracks,
      $audioTracks,
      $currentVideoTrack,
      $currentMicrophoneTrack,
      selectedCamera,
      selectedMicrophone,
      $isMicrophoneEnabled,
      $isCameraEnabled,
      toggledCameraEnabled,
      toggledMicrophoneEnabled,
    };
  },
);
