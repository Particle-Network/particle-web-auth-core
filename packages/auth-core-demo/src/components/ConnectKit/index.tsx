import { Ethereum, EthereumSepolia, Solana, SolanaDevnet, SolanaTestnet } from '@particle-network/chains';
import { ModalProvider } from '@particle-network/connectkit';
import '@particle-network/connectkit/dist/index.css';
import { evmWallets, solanaWallets } from '@particle-network/connectors';
import { isServer } from 'pages/_app';
import ConnectKitDemo from './connectKitDemo';

const ConnectKit = () => {
    const cacheOption = isServer() ? {} : JSON.parse(localStorage.getItem('customModalOptions') || '{}');
    const { themeType } = cacheOption || {};

    return (
        <ModalProvider
            options={{
                projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
                clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY as string,
                appId: process.env.NEXT_PUBLIC_APP_ID as string,
                chains: [Ethereum, EthereumSepolia, Solana, SolanaDevnet, SolanaTestnet],
                connectors: [
                    ...evmWallets({ projectId: '21d2a01621c47fb5f34b06c6390ac0bb', showQrModal: true }),
                    ...solanaWallets(),
                ],
                wallet: {
                    customStyle: {
                        supportChains: [Ethereum, EthereumSepolia, Solana, SolanaDevnet, SolanaTestnet],
                    },
                },
            }}
            theme={themeType || 'light'}
        >
            <ConnectKitDemo />
        </ModalProvider>
    );
};

export default ConnectKit;
