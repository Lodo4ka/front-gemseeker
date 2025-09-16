import React, { FC } from 'react';
import clsx from 'clsx';
import { Typography } from 'shared/ui/typography';

interface ImageItem {
  src: string;
  width: number;
  height: number;
  alt?: string;
}

interface AlbumProps {
  images: ImageItem[];
  maxHeight?: number;
  gap?: number;
  borderRadius?: number;
  maxImages?: number;
  className?: string;
}

const getGridConfig = (length: number) => {
  switch (length) {
    case 2:
      return {
        gridClass: 'grid-cols-2',
        items: [
          { row: 'row-span-1', col: 'col-span-1' },
          { row: 'row-span-1', col: 'col-span-1' },
        ],
      };
    case 3:
      return {
        gridClass: 'grid-cols-2 grid-rows-2',
        items: [
          { row: 'row-span-2', col: 'col-span-1' },
          { row: 'row-span-1', col: 'col-span-1' },
          { row: 'row-span-1', col: 'col-span-1' },
        ],
      };
    case 4:
      return {
        gridClass: 'grid-cols-2 grid-rows-2',
        items: [
          { row: 'row-span-1', col: 'col-span-1' },
          { row: 'row-span-1', col: 'col-span-1' },
          { row: 'row-span-1', col: 'col-span-1' },
          { row: 'row-span-1', col: 'col-span-1' },
        ],
      };
    case 5:
      return {
        gridClass: 'grid-cols-4 grid-rows-2',
        items: [
          { row: 'row-span-2', col: 'col-span-2' },
          { row: 'row-span-1', col: 'col-span-1' },
          { row: 'row-span-1', col: 'col-span-1' },
          { row: 'row-span-1', col: 'col-span-1' },
          { row: 'row-span-1', col: 'col-span-1' },
        ],
      };
    case 6:
      return {
        gridClass: 'grid-cols-3 grid-rows-2',
        items: [
          { row: 'row-span-1', col: 'col-span-1' },
          { row: 'row-span-1', col: 'col-span-1' },
          { row: 'row-span-1', col: 'col-span-1' },
          { row: 'row-span-1', col: 'col-span-1' },
          { row: 'row-span-1', col: 'col-span-1' },
          { row: 'row-span-1', col: 'col-span-1' },
        ],
      };
    default:
      return {
        gridClass: 'grid-cols-3 grid-rows-3',
        items: Array.from({ length: Math.min(length, 9) }, () => ({
          row: 'row-span-1',
          col: 'col-span-1',
        })),
      };
  }
};

export const Album: FC<AlbumProps> = ({
  images,
  maxHeight = 350,
  borderRadius = 12,
  maxImages = 6,
  className = '',
}) => {
  if (!images || images.length === 0) return null;

  const displayedImages = images.slice(0, maxImages);
  const remainingCount = images.length - displayedImages.length;
  const showOverlay = remainingCount > 0;

  if (displayedImages.length === 1) {
    const image = displayedImages[0];
    return (
      <div
        className={clsx('relative mb-2', className)}
        style={{ maxHeight: `${maxHeight}px`, borderRadius: `${borderRadius}px`, overflow: 'hidden' }}>
        {/* Размытый фон */}
        <div className="absolute inset-0 overflow-hidden blur-xl">
          <img src={image?.src} alt="" className="h-full w-full scale-110 object-cover opacity-30" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center">
          <img
            src={image?.src}
            alt={image?.alt || ''}
            className="max-h-full max-w-full object-contain"
            style={{
              maxHeight: `${maxHeight}px`,
            }}
          />
        </div>
      </div>
    );
  }

  const gridConfig = getGridConfig(displayedImages.length);

  return (
    <div
      className={clsx('mb-2', className)}
      style={{
        borderRadius: `${borderRadius}px`,
        overflow: 'hidden',
        maxHeight: `${maxHeight}px`,
      }}>
      <div
        className={clsx(
          'grid gap-1',
          gridConfig.gridClass,
          'sm:gap-2',
          // Специальные стили для 3 фоток
          displayedImages.length === 3 && 'grid-cols-2 grid-rows-2',
        )}>
        {displayedImages.map((image, index) => {
          const isLastImage = index === displayedImages.length - 1;
          const itemConfig = gridConfig.items[index];

          // Адаптивная высота для мобильных устройств
          const getHeight = () => {
            // На мобильных устройствах используем меньшую высоту
            const mobileHeight = Math.min(maxHeight, 300); // Максимум 300px на мобильных

            if (displayedImages.length === 2) return `${mobileHeight}px`;
            if (displayedImages.length === 3) {
              // Для 3 фоток: первая большая слева, две справа на половину высоты
              return index === 0 ? `${mobileHeight}px` : `${mobileHeight / 2}px`;
            }
            if (displayedImages.length === 4) return `${mobileHeight / 2}px`;
            if (displayedImages.length === 5) {
              return index === 0 ? `${mobileHeight}px` : `${mobileHeight / 2}px`;
            }
            if (displayedImages.length === 6) return `${mobileHeight / 2}px`;
            return `${mobileHeight / 3}px`;
          };

          return (
            <div
              key={index}
              className={clsx(
                'relative',
                itemConfig?.row,
                itemConfig?.col,
                'max-h-[300px] min-h-[120px] sm:max-h-none sm:min-h-0',
              )}
              style={{
                height: getHeight(),
                paddingBottom: displayedImages.length <= 6 ? '0' : '100%',
              }}>
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt || ''}
                  className="h-full w-full object-cover"
                  style={{
                    // Убираем принудительные квадратики для 3 фоток
                    aspectRatio: displayedImages.length === 3 ? 'auto' : '1 / 1',
                  }}
                />

                {isLastImage && showOverlay && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#000000]/90">
                    <Typography size="subheadline1" className="uppercase">
                      +{remainingCount}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
