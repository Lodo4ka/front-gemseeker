import { useUnit } from 'effector-react';
import { toggledChecked, toggledUnchecked } from '../../model';
import { ModalId } from 'shared/lib/modal';
import { Button } from 'shared/ui/button';
import { Icon } from 'shared/ui/icon';
import { ModalDefault } from 'shared/ui/modal';
import { Typography } from 'shared/ui/typography';

export const ToggleNSFWModal = ({ id, onClose }: ModalId) => {
  const [toggleChecked, toggleUnchecked] = useUnit([toggledChecked, toggledUnchecked]);
  return (
    <ModalDefault
      onClose={onClose}
      classNames={{
        wrapper: 'max-w-[360px] bg-radial-[at_50%_0%] from-blue/25 to-darkGray-1 to-85%',
        content: 'flex flex-col w-full justify-center items-center gap-4',
      }}
      id={id}>
      <div className="border-blue/20 bg-bg flex h-12 w-12 items-center justify-center rounded-full border-[0.5px]">
        <Icon name="nsfw" size={34} />
      </div>
      <div className="flex w-full flex-col items-center gap-2">
        <Typography className="text-center" size="headline3">
          Are you 18 years old?
        </Typography>
        <Typography color="secondary" className="text-center" size="subheadline2" weight="regular">
          If you are under 18, then you will be restricted from 18+ content
        </Typography>
      </div>
      <div className="flex w-full items-center gap-2">
        <Button theme="quaternary" onClick={toggleChecked} className={{ button: 'w-full' }}>
          Yes
        </Button>
        <Button theme="darkGray" onClick={toggleUnchecked} className={{ button: 'w-full' }}>
          No
        </Button>
      </div>
    </ModalDefault>
  );
};
