import { EventCallable, StoreWritable } from 'effector';
import { useUnit } from 'effector-react';
import { Popover } from 'shared/ui/popover';
import { Typography } from 'shared/ui/typography';
import { Icon } from 'shared/ui/icon';
import { clsx } from 'clsx';
import { useLocalParticipant, useMediaDeviceSelect, useRoomContext } from '@dtelecom/components-react';
import { useEffect, useState } from 'react';
import { ConnectionState } from '@dtelecom/livekit-client';

interface DeviceProps {
  $isOpen: StoreWritable<boolean>;
  toggledOpen: EventCallable<void>;
  $devices: StoreWritable<MediaDeviceInfo[]>;
  $currentDevice: StoreWritable<string | null>;
  className?: string;
  deviceSettings: {
    name: 'Microphone' | 'Camera';
    icon: {
      enabled: 'camera' | 'microphone';
      disabled: 'camera_off' | 'microphone_off';
    };
  };
  $isDeviceEnabled: StoreWritable<boolean>;
  toggledDeviceEnabled: EventCallable<void>;
  selectedDevice: EventCallable<MediaDeviceInfo>;
}

export const Device = ({
  $isOpen,
  toggledOpen,
  deviceSettings,
  $devices,
  $currentDevice,
  $isDeviceEnabled,
  toggledDeviceEnabled,
  selectedDevice,
  className,
}: DeviceProps) => {
  const [isOpen, toggleOpen] = useUnit([$isOpen, toggledOpen]);
  const [devices, currentDevice] = useUnit([$devices, $currentDevice]);
  const [isDeviceEnabled, toggleDeviceEnabled] = useUnit([$isDeviceEnabled, toggledDeviceEnabled]);
  const selectDevice = useUnit(selectedDevice);

  return (
    <Popover
      offset={8}
      isOpen={isOpen}
      className={{
        children: clsx('bg-darkGray-3 flex flex-col rounded-lg p-3', className),
      }}
      trigger={
        <button
          type="button"
          className="border-separator bg-darkGray-3 max-sm:bg-darkGray-1 flex cursor-pointer rounded-lg border-[0.5px]">
          <div
            onMouseDown={toggleDeviceEnabled}
            className="border-r-separator flex items-center gap-2 border-r-[0.5px] px-3 py-2">
            <Icon
              name={isDeviceEnabled ? deviceSettings.icon.enabled : deviceSettings.icon.disabled}
              className="text-secondary"
              size={18}
            />
            <Typography className="w-18 truncate" color="secondary" size="subheadline2">
              {deviceSettings.name}
            </Typography>
          </div>
          <div onMouseDown={toggleOpen} className="flex items-center justify-center px-3 py-[11px]">
            <Icon
              name="arrowLeft"
              className={clsx('text-secondary transform transition-transform duration-300 ease-in-out', {
                '-rotate-90': isOpen,
                'rotate-90': !isOpen,
              })}
              size={16}
            />
          </div>
        </button>
      }>
      {devices.map((device) => (
        <Typography
          className={clsx(
            'not-last:border-b-separator cursor-pointer !gap-2 not-first:pt-2 not-last:border-b-[0.5px] not-last:pb-2',
            { 'pl-5': device.deviceId !== currentDevice },
          )}
          onClick={() => selectDevice(device)}
          size="captain1"
          icon={
            currentDevice === device.deviceId
              ? { name: 'tick', size: 14, position: 'left', className: 'min-w-[14px]' }
              : undefined
          }
          key={device.deviceId}>
          {device.label}
        </Typography>
      ))}
    </Popover>
  );
};

interface DeviceLivekitProps {
  className?: string;
  $isDeviceEnabled: StoreWritable<boolean>;
  toggledDeviceEnabled: EventCallable<void>;
  deviceSettings: {
    name: 'Microphone' | 'Camera';
    icon: {
      enabled: 'camera' | 'microphone';
      disabled: 'camera_off' | 'microphone_off';
    };
  };
}

export const DeviceLivekit = ({
  deviceSettings,
  className,
  $isDeviceEnabled,
  toggledDeviceEnabled,
}: DeviceLivekitProps) => {
  const {
    devices: devices,
    activeDeviceId: activeDeviceId,
    setActiveMediaDevice: setActiveDevice,
  } = useMediaDeviceSelect({
    kind: deviceSettings.name === 'Microphone' ? 'audioinput' : 'videoinput',
  });

  const { state: roomState } = useRoomContext();
  const { localParticipant } = useLocalParticipant();

  const [deviceEnabled, toggleDeviceEnabled] = useUnit([$isDeviceEnabled, toggledDeviceEnabled]);

  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      if (deviceSettings.name === 'Microphone') {
        localParticipant.setMicrophoneEnabled(deviceEnabled);
      } else {
        localParticipant.setCameraEnabled(deviceEnabled);
      }
    }
  }, [deviceEnabled, localParticipant, roomState]);

  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <Popover
      offset={8}
      isOpen={isOpen}
      placement="top"
      className={{
        children: clsx('bg-darkGray-3 flex flex-col rounded-lg p-3', className),
      }}
      trigger={
        <button
          type="button"
          className="border-separator bg-darkGray-3 max-sm:bg-darkGray-1 flex cursor-pointer rounded-lg border-[0.5px]">
          <div
            onMouseDown={toggleDeviceEnabled}
            className="border-r-separator flex items-center gap-2 border-r-[0.5px] px-3 py-2">
            <Icon
              name={deviceEnabled ? deviceSettings.icon.enabled : deviceSettings.icon.disabled}
              className="text-secondary"
              size={18}
            />
            <Typography className="max-2lg:hidden w-20" color="secondary" size="subheadline2">
              {deviceSettings.name}
            </Typography>
          </div>
          <div onMouseDown={toggleOpen} className="flex items-center justify-center px-3 py-[11px]">
            <Icon
              name="arrowLeft"
              className={clsx('text-secondary transform transition-transform duration-300 ease-in-out', {
                '-rotate-90': isOpen,
                'rotate-90': !isOpen,
              })}
              size={16}
            />
          </div>
        </button>
      }>
      {devices.map((device) => (
        <Typography
          className={clsx(
            'not-last:border-b-separator cursor-pointer !gap-2 not-first:pt-2 not-last:border-b-[0.5px] not-last:pb-2',
            { 'pl-[22px]': device.deviceId !== activeDeviceId },
          )}
          onClick={() => {
            setActiveDevice(device.deviceId);
            setIsOpen(false);
          }}
          size="captain1"
          icon={
            activeDeviceId === device.deviceId
              ? { name: 'tick', size: 14, position: 'left', className: '&> fill-white min-w-[14px]' }
              : undefined
          }
          key={device.deviceId}>
          {device.label}
        </Typography>
      ))}
    </Popover>
  );
};
