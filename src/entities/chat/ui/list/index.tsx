import { ListWithPagination } from 'shared/ui/list-with-pagination';
import { Message, MessageSkeleton } from '../message';
import { Icon } from 'shared/ui/icon';
import { Typography } from 'shared/ui/typography';
import { useUnit } from 'effector-react';
import { $isEndReached, $messages, $messagesIds, dataRanedOut, onLoadedFirst, $ownMessageCounter } from '../../model';
import { $slug } from 'entities/stream';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { VListHandle } from 'virtua';

export const ChatList = () => {
  const [messagesIds, messages, slug, ownMessageCounter] = useUnit([
    $messagesIds,
    $messages,
    $slug,
    $ownMessageCounter,
  ]);
  const vListRef = useRef<VListHandle>(null);

  useEffect(() => {
    if (vListRef.current) {
      const index = messagesIds ? messagesIds.length - 1 : 0;
      vListRef.current.scrollToIndex(index, { smooth: true });
    }
  }, [ownMessageCounter]);
  return (
    <ListWithPagination
      vListRef={vListRef}
      list={messagesIds}
      layout="list"
      reverse
      isOnce={true}
      noData={
        <div className="mx-auto my-0 flex h-full w-full flex-col items-center justify-center gap-4">
          <Icon name="chat" className="text-secondary" size={55} />
          <Typography size="subheadline2" className="text-center" weight="regular" color="secondary">
            There are currently <br /> no messages yet.
          </Typography>
        </div>
      }
      className={{
        wrapper: 'h-full w-full p-4',
      }}
      $isDataRanedOut={$isEndReached}
      reachedEndOfList={dataRanedOut}
      onLoaded={onLoadedFirst}
      skeleton={{
        Element: <MessageSkeleton className={{ wrapper: 'mb-3' }} />,
        count: 15,
      }}
      renderItem={(messageId, index) => {
        const message = messages[slug ?? '']?.[messageId as number];
        if (!message) return null;
        if (message.type === 'donation') {
          return (
            <Message
              key={message.id}
              className={{ wrapper: clsx({ 'mt-3': index !== 0 }), author: 'hidden', message: '!text-nsfw' }}
              message={`${message.user_info.user_nickname} DONATED ${message.amount} SOL`}
              author={{ name: message.user_info.user_nickname, id: message.user_info.user_id }}
            />
          );
        }
        return (
          <Message
            key={message.id}
            className={{ wrapper: clsx({ 'mt-3': index !== 0 }) }}
            message={message.text}
            author={{ name: message.user_info.user_nickname, id: message.user_info.user_id }}
          />
        );
      }}
    />
  );
};
