import { Checkbox } from 'shared/ui/checkbox';
import { Typography } from 'shared/ui/typography';
import { $isNSFWEnabled, toggled, handleToggled } from '../model';
import { Skeleton } from 'shared/ui/skeleton';
import { useUnit } from 'effector-react';

export const ToggleNSFW = () => {
  const [handleToggle] = useUnit([handleToggled])
  return (
    <div className="flex items-center gap-2">
      <Typography size="subheadline1" color="secondary">
        NSFW
      </Typography>
      <Checkbox 
        variant="switch" 
        $isChecked={$isNSFWEnabled} 
        toggled={toggled} 
        handleClick={handleToggle}
      />
    </div>
  );
};

export const ToggleNSFWFallback = () => {
  return (
    <div className="flex items-center gap-2">
      <Skeleton isLoading className="h-5 w-24" />
      <Skeleton isLoading className="h-5 w-8 rounded-full" />
    </div>
  );
};
