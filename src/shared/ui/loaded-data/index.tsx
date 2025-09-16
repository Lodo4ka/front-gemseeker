import { EventCallable } from 'effector';
import { useUnit } from 'effector-react';
import { InView } from 'react-intersection-observer';
import clsx from 'clsx';
import { ElementType, JSX } from 'react';

interface LoadedDataProps {
  loadedData: EventCallable<any>;
  isOnce?: boolean;
  isFullSize?: boolean;
  className?: string;
  as?: ElementType<any, keyof JSX.IntrinsicElements> & string;
  params?: Record<string, any>;
}

export const LoadedData = ({ 
  loadedData, 
  isOnce = true, 
  isFullSize, 
  className, 
  as, 
  params
}: LoadedDataProps) => {
  const onLoadedData = useUnit(loadedData);

  return (
    <InView
      as={as}
      className={clsx(className, 'absolute', {
        'absolute inset-0 h-full w-full': isFullSize,
      })}
      triggerOnce={isOnce}
      onChange={(inView) => inView && onLoadedData(params)}
    />
  );
};
