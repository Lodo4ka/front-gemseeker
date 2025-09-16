declare module '*.css' {
  interface IClassNames {
    [className: string]: string;
  }
  const classnames: IClassNames;
  export = classnames;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.webp';

declare module '*.svg' {
  import React from 'react';

  const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module '*.mp4' {
  const src: string;
  export default src;
}

declare const __API_URL__: string;
declare const __NETWORK_TYPE__: string;
declare const __RPC_URL_MAINNET__: string;
declare const __RPC_URL_DEVNET__: string;
declare const __PINATA_URL__: string;
declare const __VITE_API_WS_URL__: string;
declare const __MAX_MCAP__: string;
declare const __VITE_DEV_AUTH__: string;
declare const __ALL_SUPPLY_TOKEN__: number;
declare const __AVATAR_URL__: string;
declare const __ADDRESS_BALANCE_TOKENS__: string;
declare const __YOUR_ID__: string;

declare global {
  import { SolflareExtensionProvider } from 'shared/lib/web3';

  interface Window {
    solflare: BaseExtensionProvider | undefined;
    phantom?: {
      solana: BaseExtensionProvider | undefined;
    };
  }
}
