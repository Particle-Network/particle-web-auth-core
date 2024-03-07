'use client';

import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, rainbowWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { particleGoogleWallet, particleTwitterWallet, particleWallet } from '../particleWallet';

const connectors = connectorsForWallets(
    [
        {
            groupName: 'Recommended',
            wallets: [
                particleGoogleWallet,
                particleTwitterWallet,
                particleWallet,
                metaMaskWallet,
                rainbowWallet,
                walletConnectWallet,
            ],
        },
    ],
    {
        appName: 'My RainbowKit App',
        projectId: 'YOUR_PROJECT_ID',
    }
);

const config = createConfig({
    connectors,
    chains: [mainnet, sepolia],
    transports: {
        [mainnet.id]: http('https://mainnet.example.com'),
        [sepolia.id]: http('https://sepolia.example.com'),
    },
    ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>{children}</RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
