import { HeadPause } from 'shared/ui/head-pause';
import { FooterSettingsLayout } from 'layouts/footer-settings/ui';
import { Tabs } from 'shared/ui/tabs';
import { AllStreams, NoTokenStreams, WithTokenStreams } from 'widgets/stream-list';
import { QuickBuyInput } from 'features/quick-buy';

export const LivestreamPage = () => (
  <FooterSettingsLayout>
    <div className="relative mx-auto my-0 flex w-full max-w-[1920px] flex-col gap-4">
      <HeadPause title="Live stream" pauseVariant="streams" iconName="livestream" />

      <Tabs
        controllers={[
          {
            children: 'All streams',
            theme: 'tertiary',
            name: 'all'
          },
          {
            children: 'Token stream',
            theme: 'tertiary',
            name: 'token'
          },
          {
            children: 'No token stream',
            theme: 'tertiary',
            name: 'no_token'
          },
        ]}
        contents={[<AllStreams />, <WithTokenStreams />, <NoTokenStreams />]}
        queryParamName="filter"
        between={
          <div className="relative z-1 flex max-w-[400px]">
            <QuickBuyInput />
          </div>
        }
      />
    </div>
  </FooterSettingsLayout>
);
