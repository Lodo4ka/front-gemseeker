import { useUnit } from 'effector-react';
import { $generatedWallet, copied, nextStepPressed } from '../../model';
import { Button } from 'shared/ui/button';
import { Icon } from 'shared/ui/icon';
import { Typography } from 'shared/ui/typography';
import { MouseEvent, useCallback, useState } from 'react';
import clsx from 'clsx';
import { api } from 'shared/api';
export const Step2 = () => {
  const [pending, generatedWallet] = useUnit([api.mutations.wallets.create.$pending, $generatedWallet]);
  const [nextStep, copy] = useUnit([nextStepPressed, copied]);
  const [isBlurred, setIsBlurred] = useState(true);

  const copyPrivateKey = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (generatedWallet != null) copy(generatedWallet.private_key);
    },
    [generatedWallet?.private_key, copy],
  );

  return (
    <div className="mt-4 flex flex-col gap-6">
      <div className="flex w-full flex-col gap-5">
        <div className="flex w-full flex-col gap-3">
          <Typography size="subheadline1" weight="regular">
            Wallet address
          </Typography>
          <div className="bg-darkGray-3 border-separator flex w-full items-center gap-[10px] rounded-lg border-[0.5px] px-3 py-2">
            <Typography
              skeleton={{ isLoading: pending || generatedWallet == null, className: 'w-full h-5' }}
              size="subheadline2"
              weight="regular"
              className="w-full truncate">
              {generatedWallet?.public_key}
            </Typography>
            <Icon
              onClick={() => copy(generatedWallet?.public_key)}
              name="copy"
              className="text-secondary cursor-pointer"
            />
          </div>
        </div>
        <div className="bg-separator h-[0.5px] w-full"></div>
        <div className="flex w-full flex-col">
          <Typography size="subheadline1" weight="regular">
            Private Address
          </Typography>
          <Typography className="mt-2 mb-4" size="captain1" weight="regular" color="secondary">
            Please copy the below private key and store it in a safe location.
          </Typography>
          <div
            onClick={() => setIsBlurred(false)}
            className={clsx(
              'bg-darkGray-3 border-separator relative flex w-full items-start gap-[10px] rounded-lg border-[0.5px] px-3 py-2 transition-all duration-200',
              {
                'cursor-pointer': isBlurred,
              },
            )}>
            <div
              className={clsx('flex w-full items-start gap-[10px]', {
                'pointer-events-none': isBlurred,
              })}>
              <Typography
                skeleton={{ isLoading: pending || generatedWallet == null, className: 'w-full h-10' }}
                size="subheadline2"
                weight="regular"
                className={clsx('w-full break-all transition-all duration-200', {
                  'text-secondary blur-[4px]': isBlurred,
                })}>
                {generatedWallet?.private_key}
              </Typography>
              <Icon
                onClick={copyPrivateKey}
                name="copy"
                className={clsx('text-secondary cursor-pointer', {
                  'blur-[4px]': isBlurred,
                })}
              />
            </div>
            {isBlurred && (
              <div className="absolute inset-0 flex items-center justify-center gap-2">
                <Icon name="click" />
                <Typography size="captain1" weight="medium">
                  Tap to open the private key
                </Typography>
              </div>
            )}
          </div>
          <Typography className="mt-3" size="captain1" weight="regular">
            Your private key will NOT be displayed again.
          </Typography>
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Button onClick={nextStep} className={{ button: 'w-fit shadow-[0px_0px_32px_0px_rgba(251,191,36,0.16)]' }}>
          Continue
        </Button>
      </div>
    </div>
  );
};
