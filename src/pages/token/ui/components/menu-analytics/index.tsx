import { Volume } from '../../volume';
import { TokenInfo } from '../info';

export const MenuAnalytics = () => {
  return (
    <div className="flex w-full flex-col gap-[10px]">
      <Volume />
      <div className="mt-[6px] w-full">
        <TokenInfo />
      </div>
    </div>
  );
};
