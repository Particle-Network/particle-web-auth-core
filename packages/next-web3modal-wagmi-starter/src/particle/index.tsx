'use client';

import { AuthCoreContextProvider } from '@particle-network/auth-core-modal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { type ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { arbitrum, mainnet } from 'wagmi/chains';

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '834e717f88139dccb3980b4dedf283f4';

// 2. Create wagmiConfig
const metadata = {
    name: 'Web3Modal',
    description: 'Web3Modal Example',
    url: 'http://localhost:3766', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const chains = [mainnet, arbitrum] as const;

const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    enableEIP6963: true,
});

// 3. Create modal
const web3Modal: any = createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableOnramp: true,
});

let connecteFlag = 1;

web3Modal.wagmiConfig.subscribe((state: any) => {
    if (state.status === 'connected') {
        connecteFlag = 1;
    }
    // @ts-ignore
    const particle = window?.particle;
    if (state.status === 'disconnected' && particle && particle.ethereum.isConnected() && connecteFlag !== 0) {
        const wagmiConfig = web3Modal?.wagmiConfig as any;
        const connector = wagmiConfig.connectors.find((item: any) => item.id === 'network.particle');
        connector &&
            connector.connect({ isReconnecting: true }).then((data: any) => {
                const connections = new Map(new Map()).set(connector.uid, {
                    accounts: data.accounts,
                    chainId: data.chainId,
                    connector,
                });
                const stateData = {
                    ...wagmiConfig.state,
                    current: connector.uid,
                    connections,
                    status: 'connected',
                };
                web3Modal.wagmiConfig.setState(stateData);
            });
    }
});

web3Modal.subscribeEvents((event: any) => {
    // @ts-ignore
    const particle = window?.particle;
    if (particle && event.data.event === 'MODAL_CLOSE' && particle.ethereum.isConnected()) {
        connecteFlag = 0;
        particle.ethereum.disconnect().then(() => {
            web3Modal.wagmiConfig.setState({
                chainId: 1,
                connections: {},
                status: 'disconnected',
            });
        });
    }
});

const ParticleProvider = ({ children }: { children: ReactNode }) => {
    return (
        <AuthCoreContextProvider
            options={{
                projectId: '34c6b829-5b89-44e8-90a9-6d982787b9c9',
                clientKey: 'c6Z44Ml4TQeNhctvwYgdSv6DBzfjf6t6CB0JDscR',
                appId: 'ded98dfe-71f9-4af7-846d-5d8c714d63b0',
            }}
        >
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </WagmiProvider>
        </AuthCoreContextProvider>
    );
};

export default ParticleProvider;
