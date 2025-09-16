import { pinataUrl } from 'shared/lib/base-url';

interface ImageSize {
  width: number;
  height: number;
}

function getImageSize(url: string): Promise<ImageSize> {
  return new Promise((resolve, reject) => {
    const img: HTMLImageElement = new Image();

    img.onload = (): void => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = (_event: Event | string): void => {
      reject(new Error('Failed to load image'));
    };

    img.src = pinataUrl(url) ?? '';
  });
}

interface ImageLoadResult {
  url: string;
  size?: ImageSize;
  error?: Error;
}

async function getImageSizes(urls: string[]): Promise<ImageLoadResult[]> {
  const results: Promise<ImageLoadResult>[] = urls.map(async (url): Promise<ImageLoadResult> => {
    try {
      const size = await getImageSize(url);
      return { url, size };
    } catch (error) {
      return {
        url,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  });

  return Promise.all(results);
}

export interface ImageSizes {
  src: string;
  width: number;
  height: number;
}

export async function loadImageSizes(urls: string[]): Promise<ImageSizes[]> {
  const images = await getImageSizes(urls);

  return images.map((image) => ({
    src: pinataUrl(image.url) ?? '',
    width: image.size?.width ?? 0,
    height: image.size?.height ?? 0,
  }));
}
