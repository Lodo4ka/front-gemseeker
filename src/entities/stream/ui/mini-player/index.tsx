import { LiveKitRoom } from '@dtelecom/components-react';
import { StreamListItem, VideoPlayer } from 'entities/stream';
import { formatter } from 'shared/lib/formatter';
import { Image } from 'shared/ui/image';
import { Typography } from 'shared/ui/typography';
import { useUnit } from 'effector-react';
import { finishedStream, startedStream } from '../../model/mini-player';
import { $stream, $streamInfo } from '../../model/mini-player';
import { useEffect, useState } from 'react';
import { Loader } from 'shared/ui/loader';
import { $viewer } from 'shared/viewer';
import clsx from 'clsx';
import { Skeleton } from 'shared/ui/skeleton';
import { getFullUrlImg } from 'shared/lib/full-url-img';

export type MiniPlayerProps = {
  isHovered: boolean;
  stream: StreamListItem;
};

export const MiniPlayer = ({ isHovered, stream }: MiniPlayerProps) => {
  const user = useUnit($viewer);
  const [streamSettings, startStream, finishStream] = useUnit([$stream, startedStream, finishedStream]);
  const [previewExists, setPreviewExists] = useState(false);

  const previewUrl = `https://stream-preview.gemseeker.fun/preview/${stream.slug}`;

  useEffect(() => {
    if (isHovered) startStream({ slug: stream.slug, creator: stream.creator.user_id ?? 0 });
    if (!isHovered) finishStream();
  }, [isHovered]);

  // Если это свой стрим или не наведено — показываем превью / placeholder
  if (!isHovered || stream.creator.user_id === user?.user_id) {
    return (
      <div className="relative aspect-video w-full">
        <Image preview={previewUrl} className="h-full w-full">
          {previewExists && (
            <Typography
              icon={{ size: 6, name: 'live', position: 'left' }}
              size="captain1"
              className="bg-darkGreen w-fit !gap-1 rounded-sm px-2 py-1">
              {formatter.number.uiDefault(stream.viewers)} watching
            </Typography>
          )}
        </Image>

        {/* Скрытая проверка загрузки */}
        <img
          src={previewUrl}
          className="hidden"
          onLoad={() => setPreviewExists(true)}
          onError={() => setPreviewExists(false)}
          alt="preview check"
        />

        {!previewExists && (
          <div className="bg-darkGray-3 absolute inset-0 flex items-center justify-center rounded-xl">
            <img
              src={getFullUrlImg(stream.creator.user_photo_hash ?? '', stream.creator.user_nickname ?? '')}
              className="h-30 w-30 rounded-full"
              alt="avatar"
            />
          </div>
        )}
      </div>
    );
  }

  // Если стрим загружается
  if (!streamSettings)
    return (
      <div className="bg-darkGray-3 relative flex aspect-video w-full items-center justify-center">
        <Loader />
      </div>
    );

  // Если стрим активен — показываем LiveKit
  return (
    <LiveKitRoom
      className="relative h-[278px]"
      activityModalEnabled
      serverUrl={streamSettings?.url}
      token={streamSettings?.access_token}
      connect={true}>
      <VideoPlayer
        $streamInfo={$streamInfo}
        isHost={false}
        className={{
          root: '!min-w-0',
          wrapper: 'h-full w-full',
          player: '!rounded-none',
          volume: '!z-10',
          fullscreen: 'hidden',
        }}
      />
    </LiveKitRoom>
  );
};
