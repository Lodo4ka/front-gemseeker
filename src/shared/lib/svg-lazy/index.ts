import { LazyExoticComponent, lazy, FC, SVGProps } from 'react';

type SvgComponent = FC<SVGProps<SVGSVGElement>>;

export const svgLazy = (loader: () => Promise<{ default: SvgComponent }>): LazyExoticComponent<SvgComponent> =>
  lazy(async () => {
    const module = await loader();
    return { default: module.default };
  });
