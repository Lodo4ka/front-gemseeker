import { useUnit } from 'effector-react';
import { $address, $token } from '../../model';
import { useState } from 'react';
import { Loader } from 'shared/ui/loader';
export const Bubblemap = () => {
  const [loaded, setLoaded] = useState(false);
  const [token, address] = useUnit([$token, $address]);

  return (
    <>
      {!token ||
        (!loaded && (
          <div className="flex h-full min-h-[340px] w-full items-center justify-center">
            <Loader />
          </div>
        ))}
      <iframe
        src={`https://v2.bubblemaps.io/map?address=${address}&chain=solana&partnerId=regular`}
        className="min-h-[500px] w-full rounded-[8px]"
        onLoad={() => setLoaded(true)}
      />
    </>
  );
};
