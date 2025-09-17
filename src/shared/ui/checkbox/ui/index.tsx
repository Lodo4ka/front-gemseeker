import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';
import { useUnit } from 'effector-react';
import { EventCallable, StoreWritable } from 'effector';
import { Icon, IconName } from 'shared/ui/icon';
import { Typography } from 'shared/ui/typography';

export type CheckboxVariant = 'circle' | 'square' | 'switch';

const checkboxTheme = {
  circle: {
    base: 'rounded-full border-[0.5px] transition-all duration-100 ease-in-out border-secondary relative w-[18px] h-[18px]',
    checked: 'border-yellow bg-primary border-[5px]',
  },
  square: {
    base: 'rounded-[4px] border-[1px] transition-all duration-100 ease-in-out border-secondary relative w-[18px] h-[18px] flex justify-center items-center',
    checked: 'bg-green border-green',
  },
  switch: {
    container: 'relative w-9 h-5 bg-darkGray-3 rounded-full transition-all duration-300 ease-in-out',
    circle:
      'absolute top-1/2 flex items-center justify-center -translate-y-1/2 left-[1px] w-[16px] h-[16px] bg-primary rounded-full transition-all duration-300 ease-in-out',
    checked: {
      container: {
        default: 'bg-darkGray-3',
        yellow: 'bg-yellow',
        green: 'bg-green',
      },
      circle: 'translate-x-[18px]',
    },
  },
};

type BaseCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  checked: boolean;
  toggle: () => void;
  handleClick?: () => void;
  variant?: CheckboxVariant;
  switchStyle?: 'default' | 'yellow' | 'green';
  className?: string;
  classNameSwitch?: string;
  classNameBtn?: string;
  classNameBtnChecked?: string;
  label?: {
    text: string;
    className?: string;
  };
  checkedIcon?: {
    name: IconName;
    className?: string;
  };
  uncheckedIcon?: {
    name: IconName;
    className?: string;
  };
};

const CheckboxBase = ({
  checked,
  toggle,
  variant = 'circle',
  switchStyle = 'yellow',
  label,
  checkedIcon,
  uncheckedIcon,
  handleClick,
  className,
  classNameSwitch,
  classNameBtn,
  classNameBtnChecked,
  disabled,
  ...props
}: BaseCheckboxProps) => {
  return (
    <div className={clsx('flex items-center gap-2', className)}>
      {variant === 'switch' ? (
        <div
          className={clsx(checkboxTheme.switch.container, classNameSwitch, {
            [checkboxTheme.switch.checked.container[switchStyle as 'yellow' | 'green']]: checked,
            'opacity-50': disabled,
          })}>
          <div
            className={clsx(checkboxTheme.switch.circle, classNameBtn, {
              [clsx(checkboxTheme.switch.checked.circle, classNameBtnChecked)]: checked,
            })}>
            {checkedIcon && (
              <Icon
                name={checkedIcon.name}
                size={12}
                className={clsx(
                  'absolute transition-all duration-300 ease-in-out',
                  {
                    'scale-75 opacity-0': checked,
                    'scale-100 opacity-100': !checked,
                  },
                  checkedIcon.className,
                )}
              />
            )}
            {uncheckedIcon && (
              <Icon
                name={uncheckedIcon.name}
                size={12}
                className={clsx(
                  'absolute transition-all duration-300 ease-in-out',
                  {
                    'scale-75 opacity-0': !checked,
                    'scale-100 opacity-100': checked,
                  },
                  uncheckedIcon.className,
                )}
              />
            )}
          </div>
          {checkedIcon && switchStyle === 'default' && (
            <Icon
              name={checkedIcon.name}
              size={12}
              className={clsx(
                'absolute top-1/5 left-1/8 transition-all duration-300 ease-in-out',
                {
                  'opacity-0': !checked,
                  'opacity-100': checked,
                },
                checkedIcon.className,
              )}
            />
          )}
          {uncheckedIcon && switchStyle === 'default' && (
            <Icon
              name={uncheckedIcon.name}
              size={12}
              className={clsx(
                'absolute top-1/5 right-1/8 transition-all duration-300 ease-in-out',
                {
                  'opacity-0': checked,
                  'opacity-100': !checked,
                },
                uncheckedIcon.className,
              )}
            />
          )}
          <input
            disabled={disabled}
            type="checkbox"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={handleClick ?? toggle}
            checked={checked}
            {...props}
          />
        </div>
      ) : (
        <div
          className={clsx('cursor-pointer', checkboxTheme[variant].base, {
            [checkboxTheme[variant].checked]: checked,
          })}
          onClick={() => {
            if (handleClick) {
              handleClick();
            } else {
              toggle();
            }
          }}>
          <input
            disabled={disabled}
            type="checkbox"
            className="absolute inset-0 h-full w-full cursor-pointer border-none opacity-0"
            onChange={handleClick ?? toggle}
            checked={checked}
            {...props}
          />
          {variant === 'square' && checked && <Icon name="tick" size={10} className="pointer-events-none text-white" />}
        </div>
      )}
      {label && (
        <Typography size="captain1" className={clsx('select-none', label.className)}>
          {label.text}
        </Typography>
      )}
    </div>
  );
};

type CheckboxProps = {
  $isChecked: StoreWritable<boolean>;
  toggled: EventCallable<void>;
  variant?: CheckboxVariant;
  handleClick?: () => void;
  switchStyle?: 'default' | 'yellow' | 'green';
  className?: string;
  classNameSwitch?: string;
  classNameBtn?: string;
  classNameBtnChecked?: string;
  label?: {
    text: string;
    className?: string;
  };
  checkedIcon?: {
    name: IconName;
    className?: string;
  };
  uncheckedIcon?: {
    name: IconName;
    className?: string;
  };
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;

export const Checkbox = ({ $isChecked, toggled, ...rest }: CheckboxProps) => {
  const [checked, toggle] = useUnit([$isChecked, toggled]);

  return <CheckboxBase checked={checked} toggle={toggle} {...rest} />;
};

type CheckboxFieldProps = {
  checked: boolean;
  toggle: (value: boolean) => void;
  variant?: CheckboxVariant;
  switchStyle?: 'default' | 'yellow' | 'green';
  label?: {
    text: string;
    className?: string;
  };
  checkedIcon?: {
    name: IconName;
    className?: string;
  };
  uncheckedIcon?: {
    name: IconName;
    className?: string;
  };
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;

export const CheckboxField = ({ checked, toggle, ...rest }: CheckboxFieldProps) => {
  return <CheckboxBase checked={checked} toggle={() => toggle(!checked)} {...rest} />;
};
