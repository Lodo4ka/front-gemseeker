import { VideoTrack, useLocalParticipant, useRoomContext, useTracks } from '@dtelecom/components-react';
import { DevicesLivekit } from '../devices';
import { AuthorVideo } from './author';
import { Placeholder, PlaceholderСreator } from './placeholder';
import { Track, RoomEvent, RemoteParticipant, DataPacket_Kind } from '@dtelecom/livekit-client';
import { Controls, ControlsCreator } from './controls';
import { useState, useCallback, useEffect } from 'react';

import { FullScreenWrapper } from './fullscreen';
import { AudioReference } from './audio-reference';
import clsx from 'clsx';
import { RemoteCameraPreview } from './remote-camera-preview';
import { StoreWritable } from 'effector';
import type { StreamInfo } from '../../types';

export type VideoPlayerProps = {
  isHost?: boolean;
  $streamInfo: StoreWritable<StreamInfo | null>;
  className?: {
    root?: string;
    wrapper?: string;
    volume?: string;
    fullscreen?: string;
    player?: string;
  };
};

export function VideoPlayer({ isHost = false, className, $streamInfo }: VideoPlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { name: roomName } = useRoomContext();
  const roomCtx = useRoomContext();
  const { localParticipant } = useLocalParticipant();

  const remoteTracks = useTracks([Track.Source.Camera, Track.Source.Microphone, Track.Source.ScreenShare]).filter(
    (t) => t.participant.identity !== localParticipant.identity,
  );

  const [_playerPositions, setPlayerPositions] = useState(
    new Map<string, { x: number; y: number; width: number; height: number }>(),
  );
  const textDecoder = typeof window !== 'undefined' ? new TextDecoder() : null;
  const onDataChannel = useCallback(
    (payload: Uint8Array, participant: RemoteParticipant | undefined) => {
      if (!participant || !textDecoder) return;
      try {
        const data = JSON.parse(textDecoder.decode(payload));

        if (data.channelId === 'position') {
          // Если есть targetParticipant, это сообщение для конкретного участника
          if (data.targetParticipant && data.targetParticipant !== localParticipant.identity) {
            return; // Игнорируем сообщения не для нас
          }

          // Определяем, чья это позиция - отправителя или другого участника
          const targetParticipantIdentity = data.originalParticipant || participant.identity;

          setPlayerPositions((prev) => {
            const newMap = new Map(prev);
            newMap.set(targetParticipantIdentity, data.payload);
            return newMap;
          });
        }
      } catch (error) {
        console.error('Error parsing data channel message:', error);
      }
    },
    [localParticipant.identity],
  );

  useEffect(() => {
    roomCtx.on(RoomEvent.DataReceived, onDataChannel);
    return () => {
      roomCtx.off(RoomEvent.DataReceived, onDataChannel);
    };
  }, [onDataChannel, roomCtx]);
  console.log('DEBUG: _playerPositions', _playerPositions);
  // Отправляем текущие позиции новым участникам
  useEffect(() => {
    const handleParticipantConnected = (participant: RemoteParticipant) => {
      const sendPositions = () => {
        // Отправляем все текущие позиции новому участнику
        _playerPositions.forEach((position, participantIdentity) => {
          if (participantIdentity !== participant.identity) {
            const textEncoder = new TextEncoder();
            const payload = textEncoder.encode(
              JSON.stringify({
                payload: position,
                channelId: 'position',
                targetParticipant: participant.identity,
              }),
            );
            localParticipant.publishData(payload, DataPacket_Kind.LOSSY);
          }
        });

        // Также отправляем свою позицию, если мы хост
        if (isHost) {
          // Получаем реальную позицию хоста из window
          const hostPosition = (window as any).hostCameraPosition || { x: 0, y: 0, width: 0.2, height: 0.2 };
          const textEncoder = new TextEncoder();
          const payload = textEncoder.encode(
            JSON.stringify({
              payload: hostPosition,
              channelId: 'position',
              targetParticipant: participant.identity,
              originalParticipant: localParticipant.identity,
            }),
          );
          localParticipant.publishData(payload, DataPacket_Kind.LOSSY);
        }
      };

      // Отправляем сразу
      sendPositions();

      // И повторяем через 100мс и 500мс для надежности
      setTimeout(sendPositions, 100);
      setTimeout(sendPositions, 500);
    };

    roomCtx.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
    return () => {
      roomCtx.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
    };
  }, [roomCtx, localParticipant, _playerPositions, isHost]);

  const remoteParticipants = remoteTracks
    .map((t) => t.participant)
    .filter((v, i, arr) => arr.findIndex((p) => p.identity === v.identity) === i);

  return (
    <div className={clsx('relative z-5 aspect-video h-full w-full min-w-[340px] rounded-xl', className?.root)}>
      <div className={clsx('absolute grid h-full w-full grid-cols-1 gap-2', className?.wrapper)}>
        {isHost && (
          <Placeholder participant={localParticipant}>
            <AuthorVideo />
          </Placeholder>
        )}
        {!isHost && (
          <>
            {remoteTracks.filter((t) => t.source != Track.Source.Microphone).length === 0 && (
              <FullScreenWrapper
                setIsFullscreen={setIsFullscreen}
                className={{
                  player: className?.player,
                  volume: className?.volume,
                  fullscreen: className?.fullscreen,
                }}>
                <PlaceholderСreator className={className?.player} $streamInfo={$streamInfo} />
                <ControlsCreator $streamInfo={$streamInfo} />
              </FullScreenWrapper>
            )}
            {remoteParticipants.map((participant, index) => {
              const cameraTrack = remoteTracks.find(
                (t) => t.participant.identity === participant.identity && t.source === Track.Source.Camera,
              );
              const screenTrack = remoteTracks.find(
                (t) => t.participant.identity === participant.identity && t.source === Track.Source.ScreenShare,
              );
              const pos = _playerPositions.get(participant.identity);
              if (cameraTrack && screenTrack) {
                return (
                  <RemoteCameraPreview
                    key={participant.identity}
                    participant={participant}
                    screenTrack={screenTrack}
                    cameraTrack={cameraTrack}
                    percent={pos}
                    controls={{ setIsFullscreen }}
                  />
                );
              }

              if (cameraTrack && !screenTrack) {
                return (
                  <FullScreenWrapper
                    className={{
                      player: className?.player,
                      volume: className?.volume,
                      fullscreen: className?.fullscreen,
                    }}
                    key={index}
                    setIsFullscreen={setIsFullscreen}>
                    <Placeholder participant={participant} className={className?.player}>
                      <VideoTrack
                        participant={participant}
                        source={Track.Source.Camera}
                        publication={cameraTrack.publication}
                        className="h-full w-full !rounded-xl !bg-[#00000] !object-cover"
                      />
                    </Placeholder>
                    <Controls participant={participant} />
                  </FullScreenWrapper>
                );
              }

              // Только скриншаринг
              if (screenTrack && !cameraTrack) {
                return (
                  <FullScreenWrapper
                    className={{
                      player: className?.player,
                      volume: className?.volume,
                      fullscreen: className?.fullscreen,
                    }}
                    key={index}
                    setIsFullscreen={setIsFullscreen}>
                    <Placeholder participant={participant} className={className?.player}>
                      <VideoTrack
                        participant={participant}
                        source={Track.Source.ScreenShare}
                        publication={screenTrack.publication}
                        className="h-full w-full !rounded-xl !bg-[#00000] !object-cover"
                      />
                    </Placeholder>
                    <Controls participant={participant} />
                  </FullScreenWrapper>
                );
              }

              return null;
            })}
            {remoteTracks
              .filter((t) => t.source == Track.Source.Microphone)
              .map((t) => (
                <AudioReference
                  key={t.participant.identity}
                  participant={t.participant}
                  source={t.source}
                  publication={t.publication}
                />
              ))}
          </>
        )}
      </div>

      <div className="absolute bottom-3 w-full">
        {roomName && isHost && (
          <div className="flex w-full items-center justify-center">
            <DevicesLivekit />
          </div>
        )}
      </div>
    </div>
  );
}
