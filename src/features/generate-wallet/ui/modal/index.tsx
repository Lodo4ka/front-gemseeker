import { useUnit } from 'effector-react';
import { GENERATE_WALLET_MODAL_ID } from '../../config';
import { ModalId, ModalProps } from 'shared/lib/modal';
import { ModalDefault } from 'shared/ui/modal';
import { $step } from '../../model';
import { Steps } from '../../types';
import { Step1 } from '../step-1';
import { Step2 } from '../step-2';
import { Step3 } from '../step-3';

const steps: Steps = {
  1: {
    title: {
      size: 'headline3',
      className: '!gap-2',
      icon: { position: 'left', size: 20, name: 'generateWallet' },
      children: 'Generate Wallet',
    },
    content: <Step1 />,
  },
  2: {
    title: {
      size: 'headline3',
      className: '!gap-2',
      icon: { position: 'left', size: 20, name: 'generateWallet' },
      children: 'Generate Wallet',
    },
    content: <Step2 />,
  },
  3: {
    title: {
      size: 'headline4',
      className: '!gap-2',
      icon: { position: 'left', size: 18, name: 'lock' },
      children: 'Final chance to save private key',
    },
    content: <Step3 />,
  },
};

const GenerateWalletModal = ({ id }: ModalId) => {
  const step = useUnit($step);

  const current = steps[step];
  return (
    <ModalDefault
      header={current.title}
      id={id}
      classNames={{ wrapper: 'max-w-[480px] !gap-2 border-separator border-[0.5px]' }}>
      {current.content}
    </ModalDefault>
  );
};

export const GenerateWalletModalProps: ModalProps = {
  Modal: GenerateWalletModal,
  isOpen: false,
  props: {
    id: GENERATE_WALLET_MODAL_ID,
  },
};
