import { CheckboxField } from 'shared/ui/checkbox';
import { Typography } from 'shared/ui/typography';
import { $$tokenForm } from '../../model';
import clsx from 'clsx';

import { useForm } from '@effector-reform/react';
import { DevicesWithPreview } from 'entities/stream';

export const LiveStream = ({ disabled }: { disabled: boolean }) => {
  const { fields } = useForm($$tokenForm);

  return (
    <div
      className={clsx(
        'border-separator flex w-full flex-col gap-4 rounded-[10px] border-[0.5px] p-3 transition-all duration-300 ease-in-out',
        { 'max-s:h-[370px] h-[320px]': fields.livestream.value, 'h-11': !fields.livestream.value },
      )}>
      <div className="flex w-full items-center justify-between">
        <Typography size="subheadline2" weight="regular">
          Live stream
        </Typography>
        <CheckboxField disabled={disabled} variant="switch" checked={fields.livestream.value} toggle={fields.livestream.onChange} />
      </div>
      <DevicesWithPreview
        classNames={{
          root: clsx({
            'invisible -translate-y-4 opacity-0': !fields.livestream.value,
            'visible translate-y-0 opacity-100': fields.livestream.value,
          }),
          controls: clsx({
            'invisible -translate-y-4 opacity-0': !fields.livestream.value,
            'visible translate-y-0 opacity-100': fields.livestream.value,
          }),
          videoContainer: clsx({
            'invisible -translate-y-4 opacity-0 duration-200': !fields.livestream.value,
            'visible translate-y-0 opacity-100 delay-200 duration-500': fields.livestream.value,
          }),
          userImage: clsx({
            'invisible -translate-y-4 opacity-0': !fields.livestream.value,
            'visible translate-y-0 opacity-100': fields.livestream.value,
          }),
        }}
      />
    </div>
  );
};
