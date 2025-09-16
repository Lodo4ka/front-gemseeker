import { createField } from '@effector-reform/core';
import { createFactory } from '@withease/factories';
import { createEvent, createStore, Event, sample } from 'effector';

interface UploadFilesFactoryProps<T extends readonly string[]> {
  ALLOWED_TYPES: T;
  resetFiles: Event<unknown>;
}

export const uploadFilesFactory = createFactory(
  <T extends readonly string[]>({ ALLOWED_TYPES, resetFiles }: UploadFilesFactoryProps<T>) => {
    type AllowedFileType = T[number];

    const filesSelected = createEvent<FileList>();
    const fileRemoved = createEvent<File>();
    const filesRemoved = createEvent();
    const $error = createStore<string | null>(null).reset(filesSelected);
    const $files = createStore<File[]>([]).reset(resetFiles).reset(filesRemoved);

    sample({
      clock: filesSelected,
      source: $files,
      filter: (_, files) => Array.from(files).some((file) => ALLOWED_TYPES.includes(file.type as AllowedFileType)),
      fn: (files, selectedFiles) => {
        const newFiles = Array.from(selectedFiles!).filter((file) =>
          ALLOWED_TYPES.includes(file.type as AllowedFileType),
        );
        return [...files, ...newFiles];
      },
      target: $files,
    });

    sample({
      clock: fileRemoved,
      source: $files,
      fn: (files, removedFile) => files.filter((file) => file !== removedFile),
      target: $files,
    });

    sample({
      clock: filesSelected,
      filter: (files) => Array.from(files).some((file) => !ALLOWED_TYPES.includes(file.type as AllowedFileType)),
      fn: () => `Please select an allowed file type: ${ALLOWED_TYPES.join(', ')}`,
      target: $error,
    });

    return { filesSelected, fileRemoved, $files, $error, filesRemoved };
  },
);

interface UploadFileFactoryProps<T extends readonly string[]> {
  ALLOWED_TYPES: T;
  resetFile: Event<unknown>;
}

export const uploadFileFactory = createFactory(
  <T extends readonly string[]>({ ALLOWED_TYPES, resetFile }: UploadFileFactoryProps<T>) => {
    type AllowedFileType = T[number];
    const fileSelected = createEvent<File | null>();
    const fileRemoved = createEvent();
    const $error = createStore<string | null>(null).reset(fileSelected);
    const $file = createStore<File | null>(null).reset(resetFile).reset(fileRemoved);

    sample({
      clock: fileSelected,
      filter: (file) => ALLOWED_TYPES.includes(file?.type as AllowedFileType),
      target: $file,
    });

    sample({
      clock: fileSelected,
      filter: (file) => !ALLOWED_TYPES.includes(file?.type as AllowedFileType),
      fn: () => `Please select an allowed file type: ${ALLOWED_TYPES.join(', ')}`,
      target: $error,
    });

    return { fileSelected, fileRemoved, $file, $error };
  },
);
