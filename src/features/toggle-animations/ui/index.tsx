import { Checkbox } from 'shared/ui/checkbox';
import { Typography } from 'shared/ui/typography';
import { Skeleton } from 'shared/ui/skeleton';
import { $isAnimationsEnabled, toggled } from '../model';

export const ToggleAnimations = () => {
  return (
    <div className="flex items-center gap-2">
      <Typography size="subheadline1" color="secondary">
        Animations
      </Typography>
      <Checkbox variant="switch" $isChecked={$isAnimationsEnabled} toggled={toggled} />
    </div>
  );
};

export const ToggleAnimationsFallback = () => {
  return (
    <div className="flex items-center gap-2">
      <Skeleton isLoading className="h-5 w-24" />
      <Skeleton isLoading className="h-5 w-8 rounded-full" />
    </div>
  );
};
