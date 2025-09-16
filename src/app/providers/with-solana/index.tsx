import { ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
  LedgerWalletAdapter,
  MathWalletAdapter,
  PhantomWalletAdapter,
  SafePalWalletAdapter,
  SolflareWalletAdapter,
  SolongWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { baseUrl } from 'shared/lib/base-url';

// import { WalletConnectWalletAdapter } from '@walletconnect/solana-adapter'
// import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export const withSolana = (component: () => ReactNode) => () => {
  const network = __NETWORK_TYPE__;
  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter(),
      new PhantomWalletAdapter(),
      new LedgerWalletAdapter(),
      new MathWalletAdapter(),
      new TorusWalletAdapter(),
      new SolongWalletAdapter(),
      new SafePalWalletAdapter(),
    ],
    [network],
  );

  return (
    <ConnectionProvider endpoint={baseUrl('/rpc')}>
      <WalletProvider wallets={wallets} autoConnect>
        {component()}
      </WalletProvider>
    </ConnectionProvider>
  );
};
