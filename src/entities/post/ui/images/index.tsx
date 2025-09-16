import { ModalId } from 'shared/lib/modal';
import { IMAGE_MODAL_KEY } from '../../config';
import { ModalDefault } from 'shared/ui/modal';
import { pinataUrl } from 'shared/lib/base-url';
import { Slider } from 'shared/ui/slider';
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect } from 'react';

export type ImageModalProps = {
  images: string[];
  url: string;
} & ModalId;
const ImageModal = ({ id, images, url }: ImageModalProps) => {
  const isSingleImage = images.length === 1;
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: false, slidesToScroll: 'auto' });

  useEffect(() => {
    if (emblaApi) {
      const index = images.findIndex((image) => image === url);
      console.log(index, url);
      emblaApi.scrollTo(index);
    }
  }, [emblaApi, images, url]);

  return (
    <ModalDefault
      classNames={{
        wrapper: '!bg-transparent !w-fit !shadow-none h-full !p-[65px]',
        content: 'h-full w-fit flex items-center justify-center',
        exit: {
          container: '!w-7 !h-7 !right-0 !top-0',
          content: '!w-7 !bg-primary !h-[2px]',
        },
      }}
      id={id}>
      {isSingleImage && <img src={images[0]} alt="image" className="max-h-[60vh] w-auto object-contain" />}
      {!isSingleImage && (
        <Slider emblaApi={emblaApi} emblaRef={emblaRef}>
          <div className="flex">
            {images.map((image, index) => (
              <div key={index} className="relative flex min-w-[0px] flex-[0_0_100%] items-center justify-center">
                <img src={image} alt="image" className="max-h-[60vh] w-auto object-contain" />
              </div>
            ))}
          </div>
        </Slider>
      )}
    </ModalDefault>
  );
};

export const getImageModal = (images: string[], url: string) => {
  return {
    Modal: ImageModal,
    isOpen: false,
    props: {
      id: IMAGE_MODAL_KEY,
      url: pinataUrl(url),
      images: images.map((image) => pinataUrl(image)),
    },
    classNameWrapper: '!backdrop-blur-[20px] !bg-transparent ',
  };
};
