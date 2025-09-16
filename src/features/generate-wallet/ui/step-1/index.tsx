import { useUnit } from 'effector-react';
import { generateWalletPressed } from '../../model';
import { Button } from 'shared/ui/button';
import { Typography } from 'shared/ui/typography';

export const Step1 = () => {
  const generateWallet = useUnit(generateWalletPressed);
  return (
    <div className="flex flex-col items-end gap-6">
      <Typography size="subheadline2" weight="regular" className="w-full text-left" color="secondary">
        Generate your Gemseeker trading wallet and private key
      </Typography>
      <Button onClick={generateWallet} className={{ button: 'w-fit shadow-[0px_0px_32px_0px_rgba(251,191,36,0.16)]' }}>
        Generate
      </Button>
    </div>
  );
};
