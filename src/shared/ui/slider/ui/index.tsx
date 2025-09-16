import { useDotButton, usePrevNextButtons } from 'shared/lib/slider';

import { EmblaViewportRefType } from 'embla-carousel-react';
import { ReactNode } from 'react';
import clsx from 'clsx';
import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import { Icon } from 'shared/ui/icon';

export type SliderProps = {
  children: ReactNode;
  options?: EmblaOptionsType;
  navigation?: boolean;
  className?: string;
  classNameEmbla?: string;
  emblaApi: EmblaCarouselType | undefined;
  emblaRef: EmblaViewportRefType;
  classNameNavigation?: string;
  classNameArrow?: string;
};

export const Slider = ({
  children,
  navigation = true,
  classNameEmbla,
  className,
  emblaApi,
  emblaRef,
  classNameNavigation,
  classNameArrow,
}: SliderProps) => {
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

  return (
    <div className={clsx('flex w-full flex-col items-center gap-3', classNameEmbla)}>
      <div className={clsx('overflow-hidden', className)} ref={emblaRef}>
        {children}
      </div>
      {navigation && (
        <div className={clsx('flex justify-center gap-3', classNameNavigation)}>
          <Icon
            name="arrowLeft"
            size={18}
            className={clsx('text-primary cursor-pointer', classNameArrow, {
              '!text-secondary !cursor-not-allowed': prevBtnDisabled,
            })}
            onClick={onPrevButtonClick}
          />
          <div className="flex items-center gap-1">
            {scrollSnaps.map((_, index) => (
              <button
                onClick={() => onDotButtonClick(index)}
                className={clsx('bg-secondary h-[6px] w-[6px] rounded-full', {
                  ['!bg-primary']: index === selectedIndex,
                })}
                key={index}
              />
            ))}
          </div>
          <Icon
            name="arrowRight"
            size={18}
            className={clsx('text-primary cursor-pointer', classNameArrow, {
              '!text-secondary !cursor-not-allowed': nextBtnDisabled,
            })}
            onClick={onNextButtonClick}
          />
        </div>
      )}
    </div>
  );
};
