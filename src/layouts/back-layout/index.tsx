import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { ReactNode } from 'react';
import { router } from 'shared/config/router';
import { Button } from 'shared/ui/button';

export const BackLayout = ({ children, className }: { children: ReactNode; className?: string }) => {
  const routerBase = useUnit(router.$history);

  return (
    <div className="relative w-full">
      <Button
        theme="darkGray"
        onClick={routerBase.back}
        icon={{ position: 'left', name: 'arrowLeft', size: 16 }}
        className={{
          icon: 'text-secondary',
          button: clsx(
            'text-secondary max-2lg:text-[0px] max-2lg:p-0 max-2lg:bg-transparent max-2lg:hover:bg-transparent absolute top-0 left-0 z-[10] !px-3 !py-2 !pr-4',
            className,
          ),
        }}>
        Back
      </Button>
      {children}
    </div>
  );
};
