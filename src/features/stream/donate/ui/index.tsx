import { Typography } from 'shared/ui/typography';

import { Button } from 'shared/ui/button';
import { Icon } from 'shared/ui/icon';
import { useUnit } from 'effector-react';
import { openedModal } from '../model';
import { api } from 'shared/api';
import { $isDonateAllowed } from 'entities/stream';
export const DonatePanel = () => {
  const openModal = useUnit(openedModal);
  const [pending, isDonateAllowed] = useUnit([api.mutations.stream.donate.$pending, $isDonateAllowed]);

  if (!isDonateAllowed) return null;

  return (
    <div className="bg-darkGray-1 relative flex flex-col gap-6 overflow-hidden rounded-xl p-4">
      <div className="from-yellow pointer-events-none absolute bottom-0 left-0 h-5 w-full bg-gradient-to-t to-transparent opacity-40 blur-3xl" />

      <div className="from-yellow pointer-events-none absolute top-0 left-0 h-10 w-full bg-gradient-to-b to-transparent opacity-70 blur-3xl" />

      <div className="relative z-2 flex w-full flex-col items-center gap-3">
        <div className="bg-darkGray-1 relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-[0.5px] border-[#473E24]">
          <div className="bg-yellow absolute bottom-2 left-1/2 h-2 w-6 -translate-x-1/2 rounded-full opacity-30 blur-sm" />
          <Icon name="donate" size={28} className="text-yellow relative z-2" />
        </div>
        <Typography size="headline3">Donate to the streamer</Typography>
        <Typography size="subheadline2" weight="regular" color="secondary">
          You can donate to the streamer in order <br /> for him to complete the tasks.
        </Typography>
      </div>
      <Button disabled={pending} onClick={openModal} className={{ button: 'relative z-2' }}>
        Donate
      </Button>
    </div>
  );
};
