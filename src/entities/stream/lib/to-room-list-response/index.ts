import { StreamListItem, StreamResponseWSum } from '../../types';

export function toRoomListResponse(room: StreamResponseWSum, prev?: StreamListItem): StreamListItem {
  return {
    donation_sum: room.donation_sum,
    name: room.name,
    created_at: room.created_at,
    is_nsfw: room.is_nsfw,
    slug: room.slug,
    creator: {
      user_id: room.creator.user_id,
      user_nickname: room.creator.user_nickname,
      user_photo_hash: room.creator.user_photo_hash,
    },
    viewers: room.viewers,
    preview_photo: room.preview_photo,
    stream_tokens: room.stream_tokens,
    tasks: prev?.tasks ?? [],
  };
}
