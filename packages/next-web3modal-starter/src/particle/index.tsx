'use client';

import { AuthCoreContextProvider } from '@particle-network/auth-core-modal';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { type ReactNode } from 'react';

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '834e717f88139dccb3980b4dedf283f4';

// 2. Set chains
const mainnet = {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com',
};

const goerli = {
    chainId: 5,
    name: 'Ethereum Goerli',
    currency: 'ETH',
    explorerUrl: 'https://goerli.etherscan.io',
    rpcUrl: 'https://ethereum-goerli.publicnode.com',
};

// 3. Create modal
const metadata = {
    name: 'My Website',
    description: 'My Website description',
    url: 'https://mywebsite.com', // origin must match your domain & subdomain
    icons: ['https://avatars.mywebsite.com/'],
};

const web3Modal = createWeb3Modal({
    ethersConfig: defaultConfig({ metadata }),
    chains: [mainnet, goerli],
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

const ParticleProvider = ({ children }: { children: ReactNode }) => {
    return (
        <AuthCoreContextProvider
            options={{
                projectId: '34c6b829-5b89-44e8-90a9-6d982787b9c9',
                clientKey: 'c6Z44Ml4TQeNhctvwYgdSv6DBzfjf6t6CB0JDscR',
                appId: 'ded98dfe-71f9-4af7-846d-5d8c714d63b0',
                web3Modal, // set web3Modal to particle SDK
            }}
        >
            {children}
        </AuthCoreContextProvider>
    );
};

export default ParticleProvider;
