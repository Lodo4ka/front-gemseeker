import { Button, ButtonTheme } from 'shared/ui/button';
import { ModalId, ModalProps, modalsStore } from 'shared/lib/modal';
import { ModalDefault } from 'shared/ui/modal';
import { Input } from 'shared/ui/input';
import { POST_CREATE_MODAL_ID } from '../config';
import { useUnit } from 'effector-react';
import { ChangeEvent } from 'react';
import {
  filesSelected,
  $files,
  $error,
  fileRemoved,
  createdPost,
  $text,
  changedText,
  $title,
  changedTitle,
} from '../model';
import { Typography } from 'shared/ui/typography';
import { api } from 'shared/api';
import clsx from 'clsx';
import { Skeleton } from 'shared/ui/skeleton';

const PostCreateForm = () => {
  const [files, error, text, title, creating] = useUnit([
    $files,
    $error,
    $text,
    $title,
    api.mutations.post.create.$pending,
  ]);
  const [selectFiles, removeFile, createPost, changeText, changeTitle] = useUnit([
    filesSelected,
    fileRemoved,
    createdPost,
    changedText,
    changedTitle,
  ]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) =>
    event.target.files && selectFiles(event.target.files);

  return (
    <div className="flex w-full flex-col gap-4">
      <Input
        value={title}
        onValue={changeTitle}
        classNames={{ flex: 'bg-darkGray-3' }}
        placeholder="Enter the title of your post"
      />
      <Input
        classNames={{ input: 'h-[140px] w-full resize-none', flex: 'bg-darkGray-3' }}
        as="textarea"
        value={text}
        onValue={changeText}
        placeholder="Enter the text of your post"
      />
      {error && (
        <Typography size="subheadline2" color="red">
          {error}
        </Typography>
      )}
      {files && files.length > 0 && (
        <div className="flex w-full flex-wrap items-center gap-2">
          {files.map((file) => (
            <div key={file.name} className="relative h-15 w-15 rounded-sm">
              <button
                onClick={() => removeFile(file)}
                className="absolute top-[3px] right-[3px] z-[2] h-[12px] w-[12px]">
                <div className="bg-primary h-[1px] w-[12px] rotate-45 rounded-xl" />
                <div className="bg-primary h-[1px] w-[12px] -translate-y-[1px] -rotate-45 rounded-xl" />
              </button>
              <img src={URL.createObjectURL(file)} alt={file.name} className="h-full w-full rounded-sm object-cover" />
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className="cursor-pointer">
          <Button
            theme="quaternary"
            className={{ button: 'h-[34px] min-w-[34px] cursor-pointer !p-0' }}
            icon={{ name: 'file', position: 'center' }}>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="absolute h-[34px] w-[34px] cursor-pointer opacity-0"
            />
          </Button>
        </div>

        <Button onClick={createPost} className={{ button: 'w-full' }} disabled={creating}>
          {creating ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </div>
  );
};

export const PostCreateBox = ({ className }: { className?: string }) => {
  return (
    <div className={clsx('bg-darkGray-1 flex h-fit w-full flex-col gap-4 rounded-xl p-4', className)}>
      <Typography
        size="headline4"
        className="!gap-2"
        icon={{ position: 'left', name: 'create_post', size: 20 }}
        color="secondary">
        Create Post
      </Typography>
      <PostCreateForm />
    </div>
  );
};

export const PostCreateBoxFallback = ({ className }: { className?: string }) => {
  return (
    <div className={clsx('bg-darkGray-1 flex h-fit w-full flex-col gap-4 rounded-xl p-4', className)}>
      <div className="flex items-center gap-2">
        <Skeleton isLoading className="h-5 w-5 rounded-lg" />
        <Skeleton isLoading className="h-5 w-[90px] rounded-lg" />
      </div>
      <Skeleton isLoading className="h-[158px] w-full rounded-lg" />
      <div className="flex items-center gap-1">
        <Skeleton isLoading className="bg-darkGray-2 h-[34px] w-[34px] rounded-lg" />
        <Skeleton isLoading className="h-[34px] w-full rounded-lg" />
      </div>
    </div>
  );
};

const PostCreateModal = ({ id }: ModalId) => {
  return (
    <ModalDefault
      classNames={{ wrapper: 'max-w-[548px]' }}
      id={id}
      header={{
        children: 'Create Post',
        className: '!gap-2',
        color: 'secondary',
        size: 'headline4',
        icon: { position: 'left', name: 'create_post', size: 20 },
      }}>
      <PostCreateForm />
    </ModalDefault>
  );
};

export const PostCreateModalProps: ModalProps = {
  Modal: PostCreateModal,
  isOpen: false,
  props: {
    id: POST_CREATE_MODAL_ID,
  },
};

type PostCreateProps = {
  className?: {
    button?: string;
    icon?: string;
  };
  theme?: ButtonTheme;
};

export const PostCreate = ({ className, theme }: PostCreateProps) => {
  const openModal = useUnit(modalsStore.openModal);

  return (
    <Button
      className={{ button: clsx('max-2lg:w-full whitespace-nowrap', className?.button), icon: className?.icon }}
      icon={{ name: 'create', position: 'left' }}
      theme={theme}
      onClick={() => openModal(PostCreateModalProps)}>
      Create Post
    </Button>
  );
};
