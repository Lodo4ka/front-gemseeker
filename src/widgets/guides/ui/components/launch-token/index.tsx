import clsx from 'clsx';
import { useUnit } from 'effector-react';

import { Typography } from 'shared/ui/typography';
import { desktop, GuideTemplate } from '../template';
import { Button } from 'shared/ui/button';
import { navigatedToCreateToken, openedHowItWorksModal } from 'features/how-it-works/model';
import { guideLaunchToken } from '../../../model';

const Title = () => (
  <>
    <Typography
      weight="semibold"
      className="!gap-2 text-[20px] uppercase md:text-[24px] md:leading-8 lg:text-[36px] lg:leading-10">
      launch and
      <Typography
        weight="semibold"
        as="span"
        className="text-[20px] uppercase md:text-[24px] md:leading-8 lg:text-[36px] lg:leading-10"
        color="yellow">
        stream
      </Typography>
    </Typography>
    <Typography
      weight="semibold"
      className="text-[20px] uppercase md:text-[24px] md:leading-8 lg:text-[36px] lg:leading-10">
      tokens for fun
    </Typography>
  </>
);

const Content = () => {
  const [toCreateToken, openHowItWorksModal] = useUnit([navigatedToCreateToken, openedHowItWorksModal]);
  const isDesktop = useUnit(desktop.$matches);

  return (
    <>
      <Button
        onClick={toCreateToken}
        className={{
          button: clsx('2xs:px-4 !px-2', {
            'p-3': !isDesktop,
          }),
        }}>
        + Launch token
      </Button>

      <Button
        className={{
          button: 'hidden sm:block',
        }}
        onClick={openHowItWorksModal}
        theme="quaternary">
        How it works
      </Button>
    </>
  );
};

export const LaunchTokenGuide = ({ className }: { className?: string }) => {
  const [isGuideOpen, closeGuide] = useUnit([guideLaunchToken.$isGuideOpen, guideLaunchToken.closedGuide]);

  return (
    <GuideTemplate
      title={<Title />}
      content={<Content />}
      closeGuide={closeGuide}
      isGuideOpen={isGuideOpen}
      className={className}
    />
  );
};
