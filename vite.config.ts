import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import dotenv from 'dotenv';
import svgr from 'vite-plugin-svgr';

import { generateOpenApiPlugin } from './vite/plugins/generate-openapi-client';

dotenv.config();

export default defineConfig({
  plugins: [
    generateOpenApiPlugin(),
    react(),
    tailwindcss(),
    tsconfigPaths(),
    svgr({
      include: '**/*.svg',
    }),
  ],

  define: {
    global: 'globalThis',
    'process.env': JSON.stringify(process.env),
    __API_URL__: JSON.stringify(process.env.VITE_API_URL),
    __NETWORK_TYPE__: JSON.stringify(process.env.VITE_NETWORK_TYPE),
    __RPC_URL_MAINNET__: JSON.stringify(process.env.VITE_RPC_URL_MAINNET),
    __RPC_URL_DEVNET__: JSON.stringify(process.env.VITE_RPC_URL_DEVNET),
    __PINATA_URL__: JSON.stringify(process.env.VITE_PINATA_URL),
    __VITE_API_WS_URL__: JSON.stringify(process.env.VITE_API_WS_URL),
    __MAX_MCAP__: JSON.stringify(process.env.VITE_MAX_MCAP),
    __VITE_DEV_AUTH__: JSON.stringify(process.env.VITE_DEV_AUTH),
    __ALL_SUPPLY_TOKEN__: JSON.stringify(process.env.VITE_ALL_SUPPLY_TOKEN),
    __AVATAR_URL__: JSON.stringify(process.env.VITE_AVATAR_URL),
    __ADDRESS_BALANCE_TOKENS__: JSON.stringify(process.env.VITE_ADDRESS_BALANCE_TOKENS),
    __YOUR_ID__: JSON.stringify(process.env.VITE_YOUR_ID),
  },
  optimizeDeps: {
    include: ['buffer'],
  },
  server: {
    allowedHosts: ['gemseeker.ngrok.app'],
  },
});
