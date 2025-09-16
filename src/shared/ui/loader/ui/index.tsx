import clsx from 'clsx';

interface LoaderProps {
  className?: {
    wrapper?: string;
    border?: string;
    borderYellow?: string;
    borderPrimary?: string;
  };
}

export const Loader = ({ className }: LoaderProps) => (
  <div className={clsx('relative grid h-[50px] w-[50px] place-items-center', className?.wrapper)}>
    <div
      className={clsx(
        'border-t-primary border-b-primary absolute inset-0 animate-spin rounded-full border-4 border-transparent',
        className?.border,
      )}
    />
    <div
      className={clsx(
        'border-t-yellow border-b-yellow absolute inset-0 m-2 animate-[spin_1s_linear_infinite_reverse] rounded-full border-4 border-transparent',
        className?.borderYellow,
      )}
    />
    <div
      className={clsx(
        'border-l-primary border-r-primary absolute top-1/2 left-1/2 h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-transparent',
        className?.borderPrimary,
      )}
    />
  </div>
);
