import { EventCallable } from 'effector';
import { useUnit } from 'effector-react';
import { api } from 'shared/api';
import { Button } from 'shared/ui/button';

type ArchivedActionsProps = {
  id: number;
};

export const ArchivedActions = ({ id }: ArchivedActionsProps) => {
  const unarchive = useUnit(api.mutations.wallets.unarchive.start);
  return (
    <div className="flex w-full items-center gap-2">
      <Button
        theme="quaternary"
        onClick={() => unarchive({ id })}
        className={{
          button: '!bg-darkGray-3 hover:!bg-darkGray-2 w-fit items-center justify-center',
          icon: 'text-secondary',
        }}>
        Unarchive
      </Button>
    </div>
  );
};

type AllActionsProps = {
  changedActiveTab: EventCallable<number>;
  id: number;
};
export const AllActions = ({ id, changedActiveTab }: AllActionsProps) => {
  const archive = useUnit(api.mutations.wallets.archive.start);
  const setActiveTab = useUnit(changedActiveTab);

  return (
    <div className="flex w-full items-center gap-2">
      <Button
        icon={{ position: 'center', name: 'withdraw' }}
        theme="quaternary"
        onClick={() => setActiveTab(2)}
        className={{
          button: '!bg-darkGray-3 hover:!bg-darkGray-2 h-8 w-8 items-center justify-center !p-0',
          icon: 'text-secondary',
        }}
      />
      <Button
        icon={{ position: 'center', name: 'archive' }}
        theme="quaternary"
        onClick={() => archive({ id })}
        className={{
          button: '!bg-darkGray-3 hover:!bg-darkGray-2 h-8 w-8 items-center justify-center !p-0',
          icon: 'text-secondary',
        }}
      />
    </div>
  );
};
