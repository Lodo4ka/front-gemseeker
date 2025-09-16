import { invoke } from '@withease/factories';
import { sample } from 'effector';
import { once } from 'patronum';
import { checkboxFactory } from 'shared/lib/checkbox';
import { streamSettingsFactory } from 'shared/lib/stream-settings';

export const { $isChecked: $isCameraOpen, toggled: toggledCameraOpen } = invoke(checkboxFactory, {});
export const { $isChecked: $isMicrophoneOpen, toggled: toggledMicrophoneOpen } = invoke(checkboxFactory, {});

export const { selectedCamera, selectedMicrophone, $currentCameraId, $cameras, $currentMicrophoneId, $microphones } =
  invoke(() => streamSettingsFactory({ fetchDevicesEvent: [once(toggledCameraOpen), once(toggledMicrophoneOpen)] }));

sample({
  clock: selectedCamera,
  target: toggledCameraOpen,
});

sample({
  clock: selectedMicrophone,
  target: toggledMicrophoneOpen,
});
