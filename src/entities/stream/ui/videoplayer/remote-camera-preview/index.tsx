import { useRef, useLayoutEffect, useState } from 'react';
import { FullScreenWrapper } from '../fullscreen';
import { Placeholder } from '../placeholder';
import { VideoTrack, useTrackMutedIndicator } from '@dtelecom/components-react';
import { Controls } from '../controls';
import { Track } from '@dtelecom/livekit-client';

const defaultPercent = { x: 0, y: 0, width: 0.2, height: 0.2 };

export const RemoteCameraPreview = ({ participant, screenTrack, cameraTrack, percent, controls }: any) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const p = percent || defaultPercent;
  const { isMuted } = useTrackMutedIndicator(cameraTrack.source, { participant });

  useLayoutEffect(() => {
    function updateSize() {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useLayoutEffect(() => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    }
  }, [percent]);

  const absX = p.x * containerSize.width;
  const absY = p.y * containerSize.height;
  const absW = p.width * containerSize.width || 208;
  const absH = p.height * containerSize.height || 120;

  return (
    <FullScreenWrapper setIsFullscreen={controls.setIsFullscreen}>
      <div ref={wrapperRef} className="relative h-full w-full">
        <Placeholder participant={participant}>
          <VideoTrack
            participant={participant}
            source={Track.Source.ScreenShare}
            publication={screenTrack.publication}
            className="relative h-full w-full !rounded-xl !bg-[#000000] object-cover"
          />
          {!isMuted && cameraTrack?.publication?.track && (
            <VideoTrack
              key={participant.identity + '-preview'}
              participant={participant}
              source={Track.Source.Camera}
              publication={cameraTrack.publication}
              style={{
                position: 'absolute',
                left: absX,
                top: absY,
                width: absW,
                height: absH,
                borderRadius: 8,
                zIndex: 20,
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.12)',
                pointerEvents: 'none',
                objectFit: 'cover',
              }}
              className="w-full bg-transparent !object-cover"
            />
          )}
        </Placeholder>
      </div>
      <Controls participant={participant} />
    </FullScreenWrapper>
  );
};
