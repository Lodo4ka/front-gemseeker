import { type ConnectionConfig as ConnectionConfigType } from '@solana/web3.js';

export type ConnectionConfig = {
  endpoint: string;
  config?: ConnectionConfigType;
};
