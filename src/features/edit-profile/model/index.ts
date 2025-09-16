import { invoke } from '@withease/factories';
import { createEvent, createStore, sample } from 'effector';
import { $user } from 'entities/user';
import { spread } from 'patronum';
import { api } from 'shared/api';
import { uploadFileFactory } from 'shared/lib/upload-file';
import { $viewer, type Viewer } from 'shared/viewer';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp'];

export const $isEdit = createStore<boolean>(false);
export const toggledEdit = createEvent();

export const $name = createStore<string>('');
export const $photo = createStore<string | null>(null);
export const $bio = createStore<string>('');
export const $isSubscribed = createStore<boolean>(false);
export const changedBio = createEvent<string>();
export const changedName = createEvent<string>();
export const updatedProfile = createEvent();
export const toggledSubscribed = createEvent();
export const { $file, fileSelected } = invoke(() => uploadFileFactory({ ALLOWED_TYPES, resetFile: toggledEdit }));

sample({
  clock: $user,
  filter: Boolean,
  fn: ({ subscribed }) => subscribed,
  target: $isSubscribed,
});

sample({
  clock: $user,
  filter: Boolean,
  fn: ({ user_photo_hash, user_nickname, bio }) => ({ user_photo_hash, user_nickname, bio }),
  target: spread({
    bio: $bio,
    user_nickname: $name,
    user_photo_hash: $photo,
  }),
});

sample({
  clock: changedBio,
  target: $bio,
});

sample({
  clock: api.mutations.user.update.finished.success,
  source: {
    name: $name,
    viewer: $viewer,
  },
  filter: ({ name, viewer }) => name !== '' && viewer != null,
  fn: ({ name, viewer }) => ({ ...viewer, nickname: name }) as Viewer,
  target: $viewer,
});

sample({
  clock: changedName,
  target: $name,
});

sample({
  clock: toggledEdit,
  source: $isEdit,
  fn: (isEdit) => !isEdit,
  target: $isEdit,
});

sample({
  clock: api.mutations.user.update.finished.finally,
  target: toggledEdit,
});

sample({
  clock: api.mutations.user.update.finished.success,
  fn: ({ result }) => result,
  target: $user,
});

sample({
  clock: api.mutations.user.update.finished.success,
  source: $viewer,
  filter: Boolean,
  fn: (viewer, { result }) => ({ ...viewer, photo_hash: result.user_photo_hash }),
  target: $viewer,
});

sample({
  clock: updatedProfile,
  source: {
    bio: $bio,
    photo: $file,
    nickname: $name,
  },
  fn: ({ photo, bio, nickname }) => {
    let formData: undefined | FormData = undefined;
    if (photo) {
      formData = new FormData();
      formData.append('photo', photo);
    }
    return { photo: formData, bio, nickname };
  },
  target: api.mutations.user.update.start,
});

sample({
  clock: toggledSubscribed,
  source: {
    isSubscribed: $isSubscribed,
    user_id: $user.map((user) => user?.user_id || null),
  },
  filter: ({ isSubscribed, user_id }) => isSubscribed && user_id !== null,
  fn: ({ user_id }) => user_id as number,
  target: api.mutations.user.unfollow.start,
});

sample({
  clock: toggledSubscribed,
  source: {
    isSubscribed: $isSubscribed,
    user_id: $user.map((user) => user?.user_id || null),
  },
  filter: ({ isSubscribed, user_id }) => !isSubscribed && user_id !== null,
  fn: ({ user_id }) => user_id as number,
  target: api.mutations.user.follow.start,
});

sample({
  clock: toggledSubscribed,
  source: $isSubscribed,
  fn: (isSubscribed) => !isSubscribed,
  target: $isSubscribed,
});
