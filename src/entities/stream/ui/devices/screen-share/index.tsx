import { useLocalParticipant } from '@dtelecom/components-react';
import { Track } from '@dtelecom/livekit-client';
import { $isScreenShareEnabledLivekit, toggledScreenShareEnabledLivekit } from '../../../model/devices';
import { useUnit } from 'effector-react';
import { fetchScreenShareTracks } from '../../../model';
import { Icon } from 'shared/ui/icon';
import { Typography } from 'shared/ui/typography';

export function ScreenShareButton() {
  const { localParticipant } = useLocalParticipant();
  const [isScreenShareEnabled, changeScreenShareEnabled, fetchScreenShare] = useUnit([
    $isScreenShareEnabledLivekit,
    toggledScreenShareEnabledLivekit,
    fetchScreenShareTracks,
  ]);

  const publish = async () => {
    try {
      const existingScreen = localParticipant.getTrack(Track.Source.ScreenShare);
      if (existingScreen) {
        await localParticipant.unpublishTrack(existingScreen.track!);
        existingScreen.track?.stop();
      }

      const screenTrack = await fetchScreenShare();
      if (!screenTrack) return;

      await localParticipant.publishTrack(screenTrack, {
        name: 'screen',
        source: Track.Source.ScreenShare,
      });

      screenTrack.onended = async () => {
        changeScreenShareEnabled();
      };
    } catch (error) {
      console.error('Ошибка при старте демонстрации экрана:', error);
    }
  };

  const unpublish = async () => {
    if (isScreenShareEnabled) {
      const screenPublication = localParticipant.getTrack(Track.Source.ScreenShare);
      changeScreenShareEnabled();
      if (screenPublication) {
        localParticipant.unpublishTrack(screenPublication.track!);
        screenPublication.track?.stop();
      }
    }
  };

  return (
    <button
      onClick={isScreenShareEnabled ? unpublish : publish}
      type="button"
      className="bg-darkGray-3 max-sm:bg-darkGray-1 z-10 flex h-[38px] items-center gap-2 rounded-lg px-3 py-2">
      <Icon className="text-secondary" name="share_screen" size={20} />
      <Typography className="max-2lg:hidden" color="secondary">
        {isScreenShareEnabled ? 'Stop sharing' : 'Share screen'}
      </Typography>
    </button>
  );
}
