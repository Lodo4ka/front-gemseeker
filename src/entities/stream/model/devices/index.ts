import { invoke } from '@withease/factories';
import { createEvent, createStore, sample } from 'effector';
import { once } from 'patronum';
import { checkboxFactory } from 'shared/lib/checkbox';
import { streamSettingsFactory } from 'shared/lib/stream-settings';

export const { $isChecked: $isCameraOpen, toggled: toggledCameraOpen } = invoke(checkboxFactory, {});
export const { $isChecked: $isMicrophoneOpen, toggled: toggledMicrophoneOpen } = invoke(checkboxFactory, {});

export const {
  selectedCamera,
  $isCameraEnabled,
  $isMicrophoneEnabled,
  toggledCameraEnabled,
  toggledMicrophoneEnabled,
  selectedMicrophone,
  $currentCameraId,
  $cameras,
  $currentMicrophoneId,
  $stream,
  $microphones,
} = invoke(() => streamSettingsFactory({ fetchDevicesEvent: [once(toggledCameraOpen), once(toggledMicrophoneOpen)] }));

sample({
  clock: selectedCamera,
  target: toggledCameraOpen,
});

sample({
  clock: selectedMicrophone,
  target: toggledMicrophoneOpen,
});

export const $isCameraEnabledLivekit = createStore<boolean>(false);
export const $isMicrophoneEnabledLivekit = createStore<boolean>(false);
export const toggledCameraEnabledLivekit = createEvent<void>();
export const toggledMicrophoneEnabledLivekit = createEvent<void>();

export const $isScreenShareEnabledLivekit = createStore<boolean>(false);
export const toggledScreenShareEnabledLivekit = createEvent<void>();

sample({
  clock: toggledCameraEnabledLivekit,
  source: $isCameraEnabledLivekit,
  fn: (isCameraEnabled) => !isCameraEnabled,
  target: $isCameraEnabledLivekit,
});

sample({
  clock: toggledMicrophoneEnabledLivekit,
  source: $isMicrophoneEnabledLivekit,
  fn: (isMicrophoneEnabled) => !isMicrophoneEnabled,
  target: $isMicrophoneEnabledLivekit,
});

sample({
  clock: toggledScreenShareEnabledLivekit,
  source: $isScreenShareEnabledLivekit,
  fn: (isScreenShareEnabled) => !isScreenShareEnabled,
  target: $isScreenShareEnabledLivekit,
});
