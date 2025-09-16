import { useUnit } from 'effector-react';

import { ModalId, ModalProps } from 'shared/lib/modal';
import { HOW_IT_WORKS_MODAL_ID, steps } from '../config';
import { navigatedToCreateToken } from '../model';
import { ModalDefault } from 'shared/ui/modal';
import { Button } from 'shared/ui/button';
import { Typography } from 'shared/ui/typography';

const HowItWorksModal = ({ id }: ModalId) => {
  const toCreateToken = useUnit(navigatedToCreateToken);
  
  return (
    <ModalDefault
      header={{
        children: 'How it works?',
        weight: 'medium',
        size: 'subheadline1',
        color: 'primary',
        className: 'text-primary',
      }}
      classNames={{
        wrapper: 'w-full max-w-[420px]',
        content: 'gap-6 flex-col flex w-full',
      }}
      id={id}>
      <div className="flex flex-col gap-3">
        {steps.map((title, index) => (
          <div
            key={index}
            className="border-b-separator flex flex-col gap-2 border-b-[0.5px] pb-3 last:border-b-0 last:pb-0">
            <Typography size="captain1" color="secondary">
              [ 0{index + 1} ]
            </Typography>
            <Typography size="subheadline1" weight="regular">
              {title}
            </Typography>
          </div>
        ))}
      </div>
      <Button className={{ button: 'w-full' }} onClick={toCreateToken}>Launch Token</Button>
    </ModalDefault>
  );
}

export const HowItWorksModalProps: ModalProps = {
  Modal: HowItWorksModal,
  isOpen: false,
  props: {
    id: HOW_IT_WORKS_MODAL_ID,
  },
};
