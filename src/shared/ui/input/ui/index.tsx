import { clsx } from 'clsx';
import { ChangeEventHandler, ElementType, useRef } from 'react';
import { Icon } from 'shared/ui/icon';
import { Typography } from 'shared/ui/typography';
import { InputProps, InputAddon } from './index.type';

export const themeStyles = {
  primary: 'bg-darkGray-1 border-[0.5px] border-separator border',
  secondary: 'bg-darkGray-2 border-transparent focus:border-yellow',
  tertiary: 'bg-darkGray-3 border-separator border-[0.5px]',
  clear: 'bg-transparent border-transparent',
} as const;

const renderAddon = (addon: InputAddon) => {
  if ('icon' in addon)
    return (
      <Icon
        name={addon.icon}
        onClick={addon?.onClick}
        size={addon?.size}
        className={clsx('text-secondary', addon?.className)}
      />
    );

  return (
    <Typography color="secondary" size="captain1" className={clsx('whitespace-nowrap', addon?.className)}>
      {addon.text}
    </Typography>
  );
};

export const Input = <E extends ElementType = 'input'>({
  as,
  classNames,
  theme = 'primary',
  leftAddon,
  rightAddon,
  error,
  disabled,
  onChange,
  label,
  onValue,
  onFocus,
  ...props
}: InputProps<E>) => {
  const Component = as || 'input';
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    onValue?.(event.target.value);
  };

  const handleContainerClick = () => {
    ref.current?.focus();
  };

  return (
    <div className={clsx('flex flex-col gap-2', classNames?.container)}>
      {label && (
        <Typography size="subheadline2" className={classNames?.label}>
          {label}
        </Typography>
      )}
      <div
        className={clsx(
          'flex items-center gap-[6px] rounded-lg py-2 pr-2 pl-3 transition-all duration-300',
          themeStyles[theme],
          error && '!border-red border-[0.5px]',
          disabled && 'pointer-events-none opacity-50',
          classNames?.flex,
        )}
        onClick={handleContainerClick}>
        {leftAddon && renderAddon(leftAddon)}
        <Component
          ref={(node: HTMLInputElement | HTMLTextAreaElement | null) => {
            // @ts-ignore
            ref.current = node;
          }}
          className={clsx(
            'text-primary font-regular w-full bg-transparent text-[15px] outline-none',
            'placeholder:text-secondary',
            classNames?.input,
          )}
          disabled={disabled}
          onFocus={onFocus}
          onChange={handleChange}
          {...props}
        />
        {rightAddon && renderAddon(rightAddon)}
      </div>
      {error && (
        <Typography size="captain2" weight="regular" className="text-red mt-1">
          {error}
        </Typography>
      )}
    </div>
  );
};
