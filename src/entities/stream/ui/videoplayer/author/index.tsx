import { useEffect, useRef, useState } from 'react';

import { useMediaDeviceSelect } from '@dtelecom/components-react';

import { useUnit } from 'effector-react';
import { $isCameraEnabledLivekit, $isScreenShareEnabledLivekit } from '../../../model/devices';
import { $microphoneTrack, $screenTrack, $videoTrack, $isAccordionOpen } from '../../../model';
import { Skeleton } from 'shared/ui/skeleton';
import clsx from 'clsx';
import { DraggableResizablePreview } from './resizable-preview';

export const AuthorVideo = () => {
  const isAccordionOpen = useUnit($isAccordionOpen);

  const [localVideoTrack, localScreenTrack, localMicrophoneTrack] = useUnit([
    $videoTrack,
    $screenTrack,
    $microphoneTrack,
  ]);
  const localVideoEl = useRef<HTMLVideoElement>(null);
  const localCameraPreviewEl = useRef<HTMLVideoElement>(null);
  const [isCameraEnabled, isScreenShareEnabled] = useUnit([$isCameraEnabledLivekit, $isScreenShareEnabledLivekit]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCameraPreviewLoaded, setIsCameraPreviewLoaded] = useState(false);

  // Drag & Resize state
  const parentRef = useRef<HTMLDivElement>(null);

  const { activeDeviceId: activeCameraDeviceId } = useMediaDeviceSelect({
    kind: 'videoinput',
  });

  const { activeDeviceId: activeMicrophoneDeviceId } = useMediaDeviceSelect({
    kind: 'audioinput',
  });

  useEffect(() => {
    const video = localVideoEl.current;
    if (!video) {
      return;
    }

    const setupStream = async () => {
      setIsLoaded(false);
      if (isScreenShareEnabled && localScreenTrack) {
        video.srcObject = new MediaStream([localScreenTrack]);
      } else if (isCameraEnabled && localVideoTrack) {
        await localVideoTrack.setDeviceId(activeCameraDeviceId);
        video.srcObject = new MediaStream([localVideoTrack.mediaStreamTrack]);
      } else {
        video.srcObject = null;
      }
      if (video.srcObject) {
        video.play().catch(console.error);
      }
    };

    setupStream();

    return () => {
      if (video) {
        video.srcObject = null;
      }
    };
  }, [isScreenShareEnabled, localScreenTrack, isCameraEnabled, localVideoTrack, activeCameraDeviceId]);

  useEffect(() => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setDeviceId(activeMicrophoneDeviceId);
    }
  }, [localMicrophoneTrack, activeMicrophoneDeviceId]);

  useEffect(() => {
    setIsCameraPreviewLoaded(false);
    if (
      isScreenShareEnabled &&
      localScreenTrack &&
      isCameraEnabled &&
      localVideoTrack &&
      localCameraPreviewEl.current
    ) {
      localCameraPreviewEl.current.srcObject = new MediaStream([localVideoTrack.mediaStreamTrack]);
      localCameraPreviewEl.current.play().catch(console.error);
    } else if (localCameraPreviewEl.current) {
      localCameraPreviewEl.current.srcObject = null;
    }
    return () => {
      if (localCameraPreviewEl.current) localCameraPreviewEl.current.srcObject = null;
    };
  }, [isScreenShareEnabled, localScreenTrack, isCameraEnabled, localVideoTrack]);

  useEffect(() => {
    if (
      isScreenShareEnabled &&
      isCameraEnabled &&
      localCameraPreviewEl.current &&
      localCameraPreviewEl.current.srcObject
    ) {
      setIsCameraPreviewLoaded(true);
    }
  }, [isScreenShareEnabled, isCameraEnabled, localCameraPreviewEl.current && localCameraPreviewEl.current.srcObject]);

  const handleLoadedData = () => setIsLoaded(true);
  const handleCameraPreviewLoaded = () => setIsCameraPreviewLoaded(true);

  useEffect(() => {
    const video = localVideoEl.current;
    if (!video || !document.pictureInPictureEnabled) return;

    const togglePip = async () => {
      try {
        if (!isAccordionOpen && document.pictureInPictureElement !== video) {
          await video.requestPictureInPicture();
        } else if (isAccordionOpen && document.pictureInPictureElement === video) {
          await document.exitPictureInPicture();
        }
      } catch (err) {
        console.error('Ошибка PiP:', err);
      }
    };

    togglePip();
  }, [isAccordionOpen]);

  return (
    <div ref={parentRef} className="relative h-full w-full">
      <Skeleton
        className={clsx(
          'absolute inset-0 rounded-xl transition-opacity duration-300',
          isLoaded ? 'pointer-events-none opacity-0' : 'opacity-100',
        )}
        isLoading
      />
      <video
        ref={localVideoEl}
        muted
        playsInline
        autoPlay
        className="relative h-full w-full rounded-xl bg-[#000000] object-contain"
        onLoadedData={handleLoadedData}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 1s',
        }}
      />
      {isScreenShareEnabled && isCameraEnabled && (
        <DraggableResizablePreview parentRef={parentRef} resetDeps={[isScreenShareEnabled, isCameraEnabled]}>
          <>
            <Skeleton
              className={clsx('!bg-darkGray-1 absolute inset-0 z-0 h-full w-full transition-opacity duration-300', {
                'pointer-events-none !opacity-0': isCameraPreviewLoaded,
                'opacity-100': !isCameraPreviewLoaded,
              })}
              isLoading
            />
            <video
              ref={localCameraPreviewEl}
              className="z-2 h-full w-full rounded-lg object-cover"
              muted
              playsInline
              autoPlay
              onPlaying={handleCameraPreviewLoaded}
              style={{
                opacity: isCameraPreviewLoaded ? 1 : 0,
                transition: 'opacity 1s',
              }}
            />
          </>
        </DraggableResizablePreview>
      )}
    </div>
  );
};
