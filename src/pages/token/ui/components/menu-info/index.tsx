import { useUnit } from 'effector-react';
import { $token, Details } from 'entities/token';
import { Skeleton } from 'shared/ui/skeleton';
import { Typography } from 'shared/ui/typography';

type MenuInfoProps = {
  isFallback?: boolean;
};

export const MenuInfo = ({ isFallback = false }: MenuInfoProps) => {
  const token = useUnit($token);

  if (!token || isFallback) return <MenuInfoFallback />;
  return (
    <div className="border-t-separator flex w-full flex-col gap-[10px] border-t-[0.5px] pt-3">
      <Typography color="secondary" weight="regular">
        {token.description}
      </Typography>
      <Details />
    </div>
  );
};

const MenuInfoFallback = () => {
  return (
    <div className="border-t-separator flex w-full flex-col gap-[10px] border-t-[0.5px] pt-3">
      <div className="flex w-full flex-col gap-1">
        <Skeleton className="h-5 w-full" isLoading={true} />
        <Skeleton className="h-5 w-[70%]" isLoading={true} />
      </div>
      <Details isFallback={true} />
    </div>
  );
};
