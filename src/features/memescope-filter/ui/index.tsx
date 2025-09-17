import { useState } from 'react';
import { Button } from 'shared/ui/button';
import { Icon } from 'shared/ui/icon';
import { Input } from 'shared/ui/input';
import { CheckboxField } from 'shared/ui/checkbox';
import { Typography } from 'shared/ui/typography';

type Range = {
  from: string;
  to: string;
};

type Props = {
  onClose?: () => void;
  onApply?: () => void;
  onReset?: () => void;
};

export const MemescopeFilter = ({ onClose, onApply, onReset }: Props) => {
  const [keywords, setKeywords] = useState('');

  const [mintAuth, setMintAuth] = useState(false);
  const [freezeAuth, setFreezeAuth] = useState(false);
  const [lpBurned, setLpBurned] = useState(false);
  const [top10, setTop10] = useState(false);
  const [withSocial, setWithSocial] = useState(false);

  const [liquidity, setLiquidity] = useState<Range>({ from: '0', to: '0' });
  const [volume, setVolume] = useState<Range>({ from: '0', to: '0' });
  const [age, setAge] = useState<Range>({ from: '0', to: '0' });
  const [mcap, setMcap] = useState<Range>({ from: '0', to: '0' });
  const [txns, setTxns] = useState<Range>({ from: '0', to: '0' });
  const [buys, setBuys] = useState<Range>({ from: '0', to: '0' });
  const [sells, setSells] = useState<Range>({ from: '0', to: '0' });

  const handleReset = () => {
    setKeywords('');
    setMintAuth(false);
    setFreezeAuth(false);
    setLpBurned(false);
    setTop10(false);
    setWithSocial(false);
    setLiquidity({ from: '0', to: '0' });
    setVolume({ from: '0', to: '0' });
    setAge({ from: '0', to: '0' });
    setMcap({ from: '0', to: '0' });
    setTxns({ from: '0', to: '0' });
    setBuys({ from: '0', to: '0' });
    setSells({ from: '0', to: '0' });
    onReset?.();
  };

  return (
    <div className="bg-darkGray-0 flex h-full w-full flex-col" data-name="Filter">
      <div className="border-separator bg-darkGray-0 flex items-center justify-between border-b px-5 py-4">
        <div className="text-secondary flex items-center gap-1">
          <Icon name="filters" size={20} />
          <Typography size="headline4" color="secondary" as="div">
            Filters
          </Typography>
        </div>
        <button aria-label="Close" onClick={onClose} className="hover:text-primary fill-[#7D8497]">
          <Icon name="x" size={16} />
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-5 pt-5 pb-2">
          <div className="flex flex-col gap-3">
            <Input value={keywords} onValue={setKeywords} placeholder="keyword1" label="Symbol/Name (Max 3 keywords)" />

            <div className="border-separator border-t" />

            <div className="flex flex-col gap-3">
              <CheckboxField checked={mintAuth} toggle={setMintAuth} variant="square" label={{ text: 'Mint Auth' }} />
              <CheckboxField
                checked={freezeAuth}
                toggle={setFreezeAuth}
                variant="square"
                label={{ text: 'Freeze Auth' }}
              />
              <CheckboxField checked={lpBurned} toggle={setLpBurned} variant="square" label={{ text: 'LP Burned' }} />
              <CheckboxField checked={top10} toggle={setTop10} variant="square" label={{ text: 'Top 10 Holders' }} />
              <CheckboxField
                checked={withSocial}
                toggle={setWithSocial}
                variant="square"
                label={{ text: 'With at least 1 social' }}
              />
            </div>

            <div className="border-separator border-t" />

            <SectionRange title="By Current Liquidity($)" value={liquidity} onChange={setLiquidity} />
            <SectionRange title="By Volume" value={volume} onChange={setVolume} />
            <SectionRange title="By Age (mins)" value={age} onChange={setAge} />
            <SectionRange title="By Market Cap" value={mcap} onChange={setMcap} />
            <SectionRange title="By TXNS" value={txns} onChange={setTxns} />
            <SectionRange title="By Buys" value={buys} onChange={setBuys} />
            <SectionRange title="By Sells" value={sells} onChange={setSells} />
          </div>
        </div>
        <div className="bg-darkGray-0 pointer-events-none absolute top-0 right-0 h-full w-3" aria-hidden />
      </div>

      <div className="border-separator bg-darkGray-0 flex items-center justify-between gap-2 border-t px-5 py-4">
        <Button theme="secondary" className={{ button: 'w-full' }} onClick={handleReset}>
          Reset
        </Button>
        <Button theme="primary" className={{ button: 'w-full' }} onClick={onApply}>
          Apply
        </Button>
      </div>
    </div>
  );
};

type SectionRangeProps = {
  title: string;
  value: Range;
  onChange: (next: Range) => void;
};

const SectionRange = ({ title, value, onChange }: SectionRangeProps) => {
  return (
    <div className="flex flex-col gap-3">
      <Typography size="captain1">{title}</Typography>
      <div className="flex items-center gap-2">
        <Input value={value.from} onValue={(v) => onChange({ ...value, from: v })} placeholder="0" />
        <div className="text-center">
          <Typography size="captain1">to</Typography>
        </div>
        <Input value={value.to} onValue={(v) => onChange({ ...value, to: v })} placeholder="0" />
      </div>
    </div>
  );
};
