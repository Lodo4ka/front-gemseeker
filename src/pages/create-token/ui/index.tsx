import { CreateTokenStep, $currentStep, prevStep } from 'features/token/create';
import { BackLayout } from 'layouts/back-layout';
import { Multistep } from 'shared/ui/multistep';
import { CreateStreamStep } from 'features/stream';
import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { CreateTokenSkeleton } from 'features/token/create/ui/skeleton';

const steps = [<CreateTokenStep />, <CreateStreamStep prevStep={prevStep} />];

export const CreateTokenPage = () => {
  const currentStep = useUnit($currentStep);

  return (
    <BackLayout className={clsx('max-sm:!p-0', { 'max-md:hidden': currentStep === 1 })}>
      <div className="flex h-full w-full justify-center">
        <Multistep
          steps={steps}
          $currentStep={$currentStep}
          className="bg-darkGray-1 h-full w-full max-w-[600px] flex-col rounded-2xl max-sm:bg-transparent"
        />
      </div>
    </BackLayout>
  );
};

export const CreateTokenPageFallback = () => {
  return (
    <BackLayout className={clsx('max-sm:!p-0')}>
      <div className="flex h-full w-full justify-center">
        <div className="bg-darkGray-1 h-full w-full max-w-[600px] flex-col rounded-2xl max-sm:bg-transparent">
          <CreateTokenSkeleton />
        </div>
      </div>
    </BackLayout>
  );
};
