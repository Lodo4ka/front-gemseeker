import { ChatCreate } from 'features/chat';
import { ChatList } from 'entities/chat';
import { Typography } from 'shared/ui/typography';

export const Chat = () => {
  return (
    <div className="bg-darkGray-3 max-lg:border-t-separator relative flex h-full w-full flex-col rounded-xl max-lg:mt-4 max-lg:h-[360px] max-lg:rounded-none max-lg:border-t-[0.5px] max-lg:bg-transparent">
      <Typography
        weight="bold"
        icon={{ name: 'live', size: 4, position: 'left' }}
        color="green"
        className="bg-btn-darkGreen absolute top-4 z-10 ml-4 !gap-1 rounded-xl px-3 py-[2px]">
        LIVE
      </Typography>
      <ChatList />
      <ChatCreate />
    </div>
  );
};
