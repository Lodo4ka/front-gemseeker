import { useState } from 'react';
import { Tabs } from 'shared/ui/tabs/ui';
import { CheckboxField } from 'shared/ui/checkbox';
import { Input } from 'shared/ui/input';

const TIME_TABS = ['1m', '5m', '1h', '6h', '24h'];

export const NewPairsFilter = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [sources, setSources] = useState({
    raydium: true,
    gemseeker: true,
    pump: true,
    moonshot: true,
  });
  const [minBuy, setMinBuy] = useState('0');

  return (
    <div className="flex w-full flex-col gap-2">
      <Tabs
        controllers={TIME_TABS.map((label) => ({ children: label, name: label }))}
        contents={TIME_TABS.map(() => <div />)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className={{
          controllers: {
            wrapper: 'h-[36px]'
          },
        }}
        queryParamName="np_time"
      />

      <div className="flex flex-wrap items-center gap-3">
        <CheckboxField
          checked={sources.raydium}
          toggle={(v) => setSources((s) => ({ ...s, raydium: v }))}
          variant="switch"
          label={{ text: 'Raydium' }}
        />
        <CheckboxField
          checked={sources.gemseeker}
          toggle={(v) => setSources((s) => ({ ...s, gemseeker: v }))}
          variant="switch"
          label={{ text: 'Gemseeker' }}
        />
        <CheckboxField
          checked={sources.pump}
          toggle={(v) => setSources((s) => ({ ...s, pump: v }))}
          variant="switch"
          label={{ text: 'Pump' }}
        />
        <CheckboxField
          checked={sources.moonshot}
          toggle={(v) => setSources((s) => ({ ...s, moonshot: v }))}
          variant="switch"
          label={{ text: 'Moonshot' }}
        />

        <div className="ml-auto min-w-[180px] max-w-[220px]">
          <Input
            placeholder="Buy"
            value={minBuy}
            onValue={setMinBuy}
            rightAddon={{ text: '$' }}
            classNames={{ flex: 'h-[36px]' }}
          />
        </div>
      </div>
    </div>
  );
};
