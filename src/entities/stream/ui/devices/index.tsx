import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { useUnit } from 'effector-react';
import {
  $currentCameraId,
  $cameras,
  $isCameraEnabled,
  $isCameraOpen,
  $isMicrophoneEnabled,
  $isMicrophoneOpen,
  $currentMicrophoneId,
  $microphones,
  $stream,
  selectedCamera,
  selectedMicrophone,
  toggledCameraEnabled,
  toggledCameraOpen,
  toggledMicrophoneEnabled,
  toggledMicrophoneOpen,
  $isMicrophoneEnabledLivekit,
  toggledMicrophoneEnabledLivekit,
  toggledCameraEnabledLivekit,
  $isCameraEnabledLivekit,
} from '../../model/devices';
import { $viewer } from 'shared/viewer';
import { Device, DeviceLivekit } from './device';
import { ScreenShareButton } from './screen-share';
import { getFullUrlImg } from 'shared/lib/full-url-img';

interface DevicesWithPreviewProps {
  classNames?: {
    root?: string;
    controls?: string;
    videoContainer?: string;
    video?: string;
    userImage?: string;
  };
}

export const DevicesWithPreview = ({ classNames }: DevicesWithPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const user = useUnit($viewer);

  const stream = useUnit($stream);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      className={clsx(
        'flex w-full transform flex-col items-start gap-4 transition-all delay-200 duration-500 ease-in-out',

        classNames?.root,
      )}>
      <Devices className={classNames?.controls} />
      <div
        className={clsx(
          'bg-darkGray-3 border-separator -z-1 flex h-[200px] w-full max-w-[348px] items-center justify-center rounded-xl border-[0.5px] transition-all ease-in-out',
          classNames?.videoContainer,
        )}>
        <video
          ref={videoRef}
          playsInline
          autoPlay
          className={clsx(
            'absolute aspect-video h-full w-full rounded-xl object-cover',
            { 'opacity-0': !stream },
            classNames?.video,
          )}
        />
        {user && (
          <img
            src={getFullUrlImg(user.photo_hash, user.nickname)}
            className={clsx(
              '-z-1 h-[70px] w-[70px] rounded-full transition-all delay-200 duration-500 ease-in-out',
              classNames?.userImage,
            )}
            alt="image"
          />
        )}
      </div>
    </div>
  );
};

export const Devices = ({ className }: { className?: string }) => {
  return (
    <div
      className={clsx(
        'flex w-full flex-wrap items-center gap-3 transition-all delay-200 duration-500 ease-in-out',
        className,
      )}>
      <Device
        $isOpen={$isCameraOpen}
        toggledOpen={toggledCameraOpen}
        $devices={$cameras}
        className="w-[194px] -translate-x-[83px]"
        $currentDevice={$currentCameraId}
        $isDeviceEnabled={$isCameraEnabled}
        toggledDeviceEnabled={toggledCameraEnabled}
        selectedDevice={selectedCamera}
        deviceSettings={{ name: 'Camera', icon: { enabled: 'camera', disabled: 'camera_off' } }}
      />
      <Device
        $isOpen={$isMicrophoneOpen}
        toggledOpen={toggledMicrophoneOpen}
        $devices={$microphones}
        $currentDevice={$currentMicrophoneId}
        className="w-[214px] -translate-x-[128px]"
        $isDeviceEnabled={$isMicrophoneEnabled}
        toggledDeviceEnabled={toggledMicrophoneEnabled}
        selectedDevice={selectedMicrophone}
        deviceSettings={{ name: 'Microphone', icon: { enabled: 'microphone', disabled: 'microphone_off' } }}
      />
    </div>
  );
};

export const DevicesLivekit = ({ className }: { className?: string }) => {
  return (
    <div
      className={clsx(
        'flex w-fit flex-wrap items-center gap-3 transition-all delay-200 duration-500 ease-in-out',
        className,
      )}>
      <DeviceLivekit
        $isDeviceEnabled={$isCameraEnabledLivekit}
        toggledDeviceEnabled={toggledCameraEnabledLivekit}
        className="max-2lg:translate-x-[50px] w-[194px] -translate-x-[10px]"
        deviceSettings={{ name: 'Camera', icon: { enabled: 'camera', disabled: 'camera_off' } }}
      />
      <DeviceLivekit
        $isDeviceEnabled={$isMicrophoneEnabledLivekit}
        toggledDeviceEnabled={toggledMicrophoneEnabledLivekit}
        className="w-[214px] -translate-x-[20px]"
        deviceSettings={{ name: 'Microphone', icon: { enabled: 'microphone', disabled: 'microphone_off' } }}
      />
      <ScreenShareButton />
    </div>
  );
};
