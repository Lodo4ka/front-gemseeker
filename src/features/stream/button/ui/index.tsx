import { useUnit } from 'effector-react';
import { Button } from 'shared/ui/button';
import { buttonClicked } from '../model';
import { $viewer } from 'shared/viewer';
import clsx from 'clsx';
export const StreamButton = () => {
  const clickFn = useUnit(buttonClicked);
  const user = useUnit($viewer);
  return (
    <Button
      onClick={clickFn}
      className={{ icon: clsx({ 'text-green h-[6px] w-[6px]': user?.stream !== null }) }}
      icon={{
        name: user?.stream?.slug ? 'dot' : 'livestream',
        position: 'left',
      }}
      theme="outline">
      {user?.stream?.slug ? 'Back to stream' : 'Start stream'}
    </Button>
  );
};
