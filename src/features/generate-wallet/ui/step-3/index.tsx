import { useUnit } from 'effector-react';
import { GENERATE_WALLET_MODAL_ID } from 'features/generate-wallet/config';
import { previousStepPressed } from 'features/generate-wallet/model';
import { modalsStore } from 'shared/lib/modal';
import { Button } from 'shared/ui/button';
import { Typography } from 'shared/ui/typography';

export const Step3 = () => {
  const [goBack, closeModal] = useUnit([previousStepPressed, modalsStore.closeModal]);

  const close = () => closeModal({ id: GENERATE_WALLET_MODAL_ID });

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-8">
        <Typography size="subheadline2" weight="regular" color="secondary">
          You will not be able to retrieve it again.
        </Typography>
        <div className="flex w-full items-center gap-3">
          <Button className={{ button: 'w-full' }} theme="quaternary" onClick={goBack}>
            Back
          </Button>
          <Button className={{ button: 'w-full' }} theme="primary" onClick={close}>
            I already saved it
          </Button>
        </div>
      </div>
    </div>
  );
};
