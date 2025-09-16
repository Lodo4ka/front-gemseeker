import { Guides } from 'widgets/guides';
import { RecentTransactions } from 'widgets/latest-transactions';
import { Markets } from 'widgets/markets';
import { TokenRocket } from 'widgets/token-rocket';
import { Slider } from 'shared/ui/slider';
import { RecentActivity } from 'widgets/latest-activity';
import { FooterSettingsLayout } from 'layouts/footer-settings/ui';
import { Top10Streams } from 'widgets/stream-list';
import useEmblaCarousel from 'embla-carousel-react';

export const RecentTransactionsSlider = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: false, slidesToScroll: 'auto' });
  return (
    <Slider
      emblaApi={emblaApi}
      emblaRef={emblaRef}
      classNameEmbla="!max-w-[1800px] !block !gap-0"
      className="gap-2 xl:hidden"
      navigation={false}>
      <div className="ml-[-10px] flex touch-pan-y">
        <RecentTransactions variant="top" />
      </div>
    </Slider>
  );
};

export const MemepadPage = () => {
  return (
    <FooterSettingsLayout>
      <div className="flex w-full flex-col">
        <RecentTransactionsSlider />

        <Guides />

        <div
          className={
            'grid-rows-auto mx-auto mt-2 grid w-full max-w-[1920px] grid-cols-1 items-start gap-4 overflow-hidden sm:mt-4 lg:grid-cols-[2fr_1fr] xl:grid-cols-[2fr_1fr_1fr]'
          }>
          <TokenRocket />
          <RecentTransactions variant="side" />
          <RecentActivity />
        </div>

        <Top10Streams />

        <Markets />
      </div>
    </FooterSettingsLayout>
  );
};

export const MemepadFallback = () => {
  // const isGuideOpen = useUnit($isGuideOpen);

  return (
    <div className="flex w-full flex-col">
      <RecentTransactionsSlider />

      <Guides />

      <div
        className={
          'grid-rows-auto mx-auto mt-2 grid w-full max-w-[1920px] grid-cols-1 items-start gap-4 overflow-hidden sm:mt-4 lg:grid-cols-[2fr_1fr] xl:grid-cols-[2fr_1fr_1fr]'
        }>
        <TokenRocket />
        <RecentTransactions variant="side" />
        <RecentActivity />
      </div>

      <Top10Streams />

      <Markets />
    </div>
  );
};
