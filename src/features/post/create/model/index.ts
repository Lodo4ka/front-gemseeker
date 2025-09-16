import { combine, createEvent, createStore, sample } from 'effector';
import { api } from 'shared/api';
import { modalsStore } from 'shared/lib/modal';
import { POST_CREATE_MODAL_ID } from '../config';
import { invoke } from '@withease/factories';
import { uploadFilesFactory } from 'shared/lib/upload-file';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'];

export const { $error, $files, fileRemoved, filesSelected } = invoke(() =>
  uploadFilesFactory({ resetFiles: api.mutations.post.create.finished.success, ALLOWED_TYPES }),
);

export const $text = createStore<string>('').reset(api.mutations.post.create.finished.success);
export const $title = createStore<string>('').reset(api.mutations.post.create.finished.success);
export const changedText = createEvent<string>('');
export const changedTitle = createEvent<string>('');
export const createdPost = createEvent();
export const $areInputsEmpty = combine($files, $text, $title, (files, text, title) => {
  const hasFiles = files.length > 0;
  const hasText = text && text.trim().length > 0;
  const hasTitle = title && title.trim().length > 0;

  return !hasFiles && !hasText && !hasTitle;
});

sample({
  clock: changedText,
  target: $text,
});

sample({
  clock: changedTitle,
  target: $title,
});

sample({
  clock: createdPost,
  source: {
    files: $files,
    text: $text,
    title: $title,
    empty: $areInputsEmpty,
  },
  filter: ({ empty }) => !empty,
  fn: ({ files, text, title }) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    return { files: formData, text, title };
  },
  target: api.mutations.post.create.start,
});

sample({
  clock: createdPost,
  source: $areInputsEmpty,
  filter: Boolean,
  fn: () => 'Fields cannot be empty',
  target: $error,
});

sample({
  clock: api.mutations.post.create.finished.success,
  fn: () => ({ id: POST_CREATE_MODAL_ID }),
  target: modalsStore.closeModal,
});
