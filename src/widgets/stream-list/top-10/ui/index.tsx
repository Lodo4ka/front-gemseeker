import { Slider } from 'shared/ui/slider';
import { HeadPause } from 'shared/ui/head-pause';
import { $allStreamsIds, StreamCard } from 'entities/stream';
import { useUnit } from 'effector-react';
import { LivestreamTokenFallback } from 'entities/token';
import { onLoadedFirst } from '../model';
import { useInView } from 'react-intersection-observer';
import useEmblaCarousel from 'embla-carousel-react';

export const Top10Streams = () => {
  const streamIds = useUnit($allStreamsIds.map((ids) => ids?.slice(0, 10) ?? null));
  const onLoaded = useUnit(onLoadedFirst);
  const [inViewRef] = useInView({ onChange: (inView) => inView && onLoaded() });
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: false, slidesToScroll: 'auto' });

  return (
    <div ref={inViewRef} className="relative mt-2 flex w-full flex-col gap-2 sm:mt-4 md:gap-4">
      {streamIds?.length !== 0 && (
        <>
          <HeadPause title="Top 10 Live streams" pauseVariant="streams" iconName="camera" />
          <Slider
            emblaApi={emblaApi}
            emblaRef={emblaRef}
            classNameEmbla="max-w-[1800px] items-start"
            className="w-full !overflow-visible"
            classNameArrow="!hidden"
            classNameNavigation="mx-auto relative z-[1]">
            <div className="ml-[-10px] flex">
              {streamIds === null &&
                Array.from({ length: 10 }).map((_, i) => (
                  <div className="relative min-w-[0px] flex-[0_0_100%] pl-[10px] md:flex-[0_0_50%] xl:flex-[0_0_33.33%] 2xl:flex-[0_0_25%]">
                    <LivestreamTokenFallback key={i} />
                  </div>
                ))}
              {streamIds?.map((streamId) => (
                <div
                  key={streamId}
                  className="relative min-w-[0px] flex-[0_0_100%] pl-[10px] md:flex-[0_0_50%] xl:flex-[0_0_33.33%] 2xl:flex-[0_0_25%]">
                  <StreamCard slug={streamId} />
                </div>
              ))}
            </div>
          </Slider>
        </>
      )}
    </div>
  );
};
