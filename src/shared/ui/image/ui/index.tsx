import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { ImgHTMLAttributes, ReactNode, useEffect, useState } from 'react';
import { Skeleton } from 'shared/ui/skeleton';
import { hoveredImg } from 'shared/viewer/model/img-scope';

interface ImageProps {
  preview?: string;
  children?: ReactNode;
  className?: string;
}

export const Image = ({ preview, children, className }: ImageProps) => {
  return (
    <div style={{ backgroundImage: `url('${preview}')` }} className={clsx(className, 'bg-cover bg-center')}>
      {children}
    </div>
  );
};

interface ImageHoverProps extends ImageProps, ImgHTMLAttributes<HTMLImageElement> {
  alt?: string;
  classNameWrapper?: string;
  classNameImg?: string;
  previewSize?: number;
}

export const ImageHover = ({
  preview,
  alt = '',
  className,
  classNameWrapper,
  classNameImg,
  previewSize = 200,
  ...props
}: ImageHoverProps) => {
  const handleHoverImg = useUnit(hoveredImg);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const margin = 20;

    const spaceBelow = window.innerHeight - clientY;

    const showAbove = spaceBelow < previewSize + margin;

    handleHoverImg({
      preview,
      alt,
      previewSize,
      positionAbove: showAbove,
      mousePos: {
        x: clientX,
        y: clientY,
      },
    });
  };

  return (
    <div
      className={clsx('relative inline-block bg-transparent overflow-hidden', classNameWrapper ?? className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => handleHoverImg(null)}>
      <img src={preview} alt={alt} className={clsx('object-cover', classNameImg ?? className)} {...props} />
    </div>
  );
};

type ImageWrapperProps = ImgHTMLAttributes<HTMLImageElement> & {
  classNames?: {
    both?: string;
    skeleton?: string;
    image?: string;
  };
  isHoverImg?: boolean;
};

export const ImageWrapper = ({ classNames, isHoverImg, ...props }: ImageWrapperProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const AsImg = isHoverImg ? ImageHover : 'img';

  return (
    <div className="relative">
      <Skeleton
        isLoading
        className={clsx(
          classNames?.skeleton,
          classNames?.both,
          'absolute inset-0 transition-opacity duration-300',
          isLoaded ? 'hidden opacity-0' : 'opacity-100',
        )}
      />
      <AsImg
        {...props}
        preview={props.src}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(false)}
        className={clsx(
          classNames?.image,
          classNames?.both,
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  );
};
