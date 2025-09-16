import { Checkbox } from 'shared/ui/checkbox';
import { $isChecked, toggled } from '../model';
import { Skeleton } from 'shared/ui/skeleton';
export const ToggleView = () => {
  return (
    <Checkbox
      className='ml-auto'
      classNameSwitch='!w-11 !h-6'
      classNameBtn='w-[20px] h-[20px]'
      classNameBtnChecked='translate-x-[22px]'
      checkedIcon={{ name: 'cards', className: 'text-darkGray-2' }}
      uncheckedIcon={{ name: 'table', className: 'text-darkGray-2' }}
      variant="switch"
      switchStyle="default"
      $isChecked={$isChecked}
      toggled={toggled}
    />
  );
};

export const ToggleViewFallback = () => <Skeleton isLoading className="h-5 w-8 rounded-full" />;
