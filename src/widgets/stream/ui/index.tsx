import { LiveKitRoom } from '@dtelecom/components-react';
import clsx from 'clsx';
import { useUnit } from 'effector-react';
import {
  $isAccordionOpen,
  $isHost,
  $stream,
  $streamInfo,
  $tasks,
  toggledAccordionOpen,
  VideoPlayer,
} from 'entities/stream';
import { api } from 'shared/api';
import { AccordionControlled } from 'shared/ui/accordion';
import { Button } from 'shared/ui/button';
import { Typography } from 'shared/ui/typography';
import { Chat } from 'widgets/chat';
import { Tasks } from 'widgets/tasks';
import { deletedStream } from '../model';
import { Skeleton } from 'shared/ui/skeleton';
import { defaultMQ } from 'shared/lib/use-media';

export const StreamAccordion = ({ className }: { className?: string }) => {
  const lg2 = useUnit(defaultMQ.lg2.$matches);
  const [isHost, stream] = useUnit([$isHost, $stream]);
  const [deleteStream, pending] = useUnit([deletedStream, api.mutations.stream.delete.$pending]);
  // !lg2 && 
  if (!stream || lg2) return null;

  return (
    <AccordionControlled
      $isOpen={$isAccordionOpen}
      toggledOpen={toggledAccordionOpen}
      header={{
        position: 'right',
        content: (
          <div className="flex w-full items-center justify-between">
            <Typography size="headline4" color="secondary">
              Live streams
            </Typography>
            {stream.is_creator && (
              <Button
                theme="darkGray"
                disabled={pending}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteStream();
                }}
                className={{ button: '!gap-2, text-secondary' }}
                icon={{ name: 'logout', size: 16, position: 'left' }}>
                {pending ? 'Ending...' : 'End the stream'}
              </Button>
            )}
          </div>
        ),
      }}
      className={{
        root: clsx('bg-darkGray-1 mx-auto my-0 w-full rounded-xl p-4 max-lg:px-0 max-lg:pb-0', className),
        header: 'w-full max-lg:px-4',
        content: 'w-full',
        icon: 'w-full',
      }}>
      <LiveKitRoom
        className="mt-3 grid h-full w-full grid-cols-[1fr_420px] items-center gap-[10px] max-xl:grid-cols-[1fr_320px] max-lg:flex max-lg:w-full max-lg:flex-col"
        serverUrl={stream.url}
        token={stream.access_token}
        connect={true}>
        <VideoPlayer $streamInfo={$streamInfo} isHost={isHost} className={{ root: '', wrapper: 'max-lg:px-4' }} />
        <Chat />
      </LiveKitRoom>
      <Tasks type="mcap" className="overflow-scroll max-lg:!mt-0 max-lg:px-4 max-lg:!pb-6" />
    </AccordionControlled>
  );
};

type StreamBlockProps = {
  type?: 'mcap' | 'donation';
  className?: {
    tasks?: string;
    tasksInside?: string;
  };
};

export const StreamBlock = ({ type = 'mcap', className }: StreamBlockProps) => {
  const [isHost, stream, tasks] = useUnit([$isHost, $stream, $tasks]);
  const [deleteStream, pending] = useUnit([deletedStream, api.mutations.stream.delete.$pending]);

  if (!stream) return null;

  return (
    <div className="flex w-full max-w-[1920px] flex-col gap-4">
      <div className="bg-darkGray-1 h-full w-full rounded-xl pt-4">
        <div className="flex h-full w-full items-center justify-between px-4">
          <Typography
            icon={{ name: 'livestream', size: 20, position: 'left' }}
            className="!gap-2"
            size="headline4"
            color="secondary">
            Live streams
          </Typography>
          {stream.is_creator && (
            <Button
              theme="darkGray"
              disabled={pending}
              onClick={(e) => {
                e.stopPropagation();
                deleteStream();
              }}
              className={{ button: '!gap-2, text-secondary' }}
              icon={{ name: 'logout', size: 16, position: 'left' }}>
              {pending ? 'Ending...' : 'End stream'}
            </Button>
          )}
        </div>
        <LiveKitRoom
          className="mt-3 flex h-full w-full flex-col gap-6"
          serverUrl={stream.url}
          token={stream.access_token}
          connect={true}>
          <div className="grid h-full w-full gap-[10px] max-lg:flex-col lg:grid-cols-[1fr_320px] lg:px-4 lg:pb-4 xl:grid-cols-[1fr_420px]">
            <VideoPlayer $streamInfo={$streamInfo} isHost={isHost} className={{ wrapper: 'max-lg:px-4' }} />
            <Chat />
          </div>
          <Tasks
            type={type}
            className={clsx('max-[824px]:hidden max-lg:px-4 max-lg:pb-4', className?.tasks, className?.tasksInside)}
          />
        </LiveKitRoom>
      </div>
      {tasks.length > 0 && (
        <div className="bg-darkGray-1 flex w-full flex-col gap-5 rounded-xl p-4 lg:hidden">
          <Typography
            icon={{ name: 'tasks', size: 20, position: 'left' }}
            className="!gap-2"
            size="headline4"
            color="secondary">
            Tasks
          </Typography>
          <Tasks type={type} className={clsx('!mt-0 !border-t-transparent !pt-0 !pb-6', className?.tasks)} />
        </div>
      )}
    </div>
  );
};

export const StreamBlockSkeleton = () => (
  <div className="flex w-full max-w-[1920px] flex-col gap-4">
    <div className="bg-darkGray-1 h-full w-full rounded-xl pt-4">
      <div className="flex h-full w-full items-center justify-between px-4">
        <Skeleton isLoading={true} className="h-8 w-40 rounded" />
        <Skeleton isLoading={true} className="h-8 w-32 rounded" />
      </div>
      <div className="mt-3 flex h-[480px] w-full flex-col gap-6">
        <div className="grid h-full w-full gap-[10px] max-lg:flex-col lg:grid-cols-[1fr_320px] lg:px-4 lg:pb-4 xl:grid-cols-[1fr_420px]">
          <Skeleton isLoading={true} className="h-[360px] w-full rounded-xl" />
          <Skeleton isLoading={true} className="h-[360px] w-full rounded-xl" />
        </div>
        <div className="max-[824px]:hidden max-lg:px-4 max-lg:pb-4">
          <Skeleton isLoading={true} className="mb-2 h-12 w-1/2 rounded" />
          <Skeleton isLoading={true} className="h-24 w-full rounded" />
        </div>
      </div>
    </div>
    <div className="bg-darkGray-1 flex w-full flex-col gap-5 rounded-xl p-4 lg:hidden">
      <Skeleton isLoading={true} className="mb-2 h-8 w-40 rounded" />
      <Skeleton isLoading={true} className="h-24 w-full rounded" />
    </div>
  </div>
);
