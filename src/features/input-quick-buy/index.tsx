import { useState } from 'react';
import { Typography } from 'shared/ui/typography';
import { Input } from 'shared/ui/input';

type Props = {
  value?: string;
  onChange?: (v: string) => void;
};

export const InputQuickBuy = ({ value = '', onChange }: Props) => {
  const [local, setLocal] = useState<string>(value);
  const [isUsd, setIsUsd] = useState<boolean>(true);

  const handleValue = (v: string) => {
    setLocal(v);
    onChange?.(v);
  };

  return (
    <div className="border-separator flex h-[36px] items-center gap-3 rounded-lg bg-[rgb(34,40,53)] p-[2px]">
      <Typography size="subheadline2" className="text-primary" icon={{ name: 'energy', position: 'left', size: 16 }}>
        Buy
      </Typography>
      <div className="border-separator relative flex max-w-[113px] flex-1 items-center rounded-lg bg-[rgb(26,30,40)]">
        <Input
          value={local}
          onValue={handleValue}
          placeholder="0"
          theme="clear"
          classNames={{
            flex: '!bg-transparent !border-none !pl-4 !py-1 !pr-16 rounded-[12px]',
            input: 'text-[15px]',
          }}
        />
        <button
          type="button"
          className="absolute top-1/2 right-2 -translate-y-1/2"
          onClick={() => setIsUsd((v) => !v)}
          aria-label="Toggle unit">
          <div
            className={`bg-darkGray-2 flex h-[20px] w-[48px] items-center rounded-full px-[2px] transition-all ${
              isUsd ? 'justify-end' : 'justify-start'
            }`}>
            <span className="bg-primary text-darkGray-1 flex h-[20px] w-[20px] items-center justify-center rounded-full text-[14px] leading-none font-medium shadow-[0_0_0_1px_rgba(255,255,255,0.1)]">
              $
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
