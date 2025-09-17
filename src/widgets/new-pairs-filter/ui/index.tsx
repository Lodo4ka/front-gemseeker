import { useState } from 'react';
import { Tabs } from 'shared/ui/tabs/ui';
import { CheckboxField } from 'shared/ui/checkbox';
import { InputQuickBuy } from 'features/input-quick-buy';

const TIME_TABS = ['1m', '5m', '1h', '6h', '24h'];

export const NewPairsFilter = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [sources, setSources] = useState({
    raydium: true,
    gemseeker: true,
    pump: true,
    moonshot: true,
  });

  return (
    <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2">
      <div className="flex items-center justify-center gap-x-4 gap-y-2">
        <Tabs
          controllers={TIME_TABS.map((label) => ({ children: label, name: label }))}
          contents={TIME_TABS.map(() => (
            <div />
          ))}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className={{
            controllers: {
              wrapper: 'h-[36px]',
            },
          }}
          queryParamName="np_time"
        />

        <div className="mb-3 flex items-center justify-center gap-3">
          <CheckboxField
            checked={sources.raydium}
            toggle={(v) => setSources((s) => ({ ...s, raydium: v }))}
            variant="square"
            label={{ text: 'Raydium' }}
          />
          <CheckboxField
            checked={sources.gemseeker}
            toggle={(v) => setSources((s) => ({ ...s, gemseeker: v }))}
            variant="square"
            label={{ text: 'Gemseeker' }}
          />
          <CheckboxField
            checked={sources.pump}
            toggle={(v) => setSources((s) => ({ ...s, pump: v }))}
            variant="square"
            label={{ text: 'Pump' }}
          />
          <CheckboxField
            checked={sources.moonshot}
            toggle={(v) => setSources((s) => ({ ...s, moonshot: v }))}
            variant="square"
            label={{ text: 'Moonshot' }}
          />
        </div>
      </div>

      <div className="ml-auto max-w-[220px] min-w-[180px]">
        <InputQuickBuy />
      </div>
    </div>
  );
};
