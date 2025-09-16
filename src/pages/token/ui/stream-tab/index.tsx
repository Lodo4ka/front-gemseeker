import { useUnit } from 'effector-react';
import { $address } from 'entities/token';
import { StreamPanel } from 'features/stream/create';
import { defaultMQ } from 'shared/lib/use-media';
import { StreamBlock } from 'widgets/stream';

export const StreamTab = () => {
  const lg2 = useUnit(defaultMQ.lg2.$matches);
  return (
    <div className="flex-col">
      {lg2 && <StreamBlock />}
      <StreamPanel $address={$address} />
    </div>
  );
};
