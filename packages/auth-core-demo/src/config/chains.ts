import type { ChainInfo } from '@particle-network/chains';
import { chains as particleChains } from '@particle-network/chains';
import type { Chain as ViemChain } from 'viem';
import { defineChain } from 'viem';

function convertToDefineChain(particleChains: ChainInfo[]): ViemChain[] {
    return particleChains.map((chain) => {
        return defineChain({
            id: chain.id,
            name: chain.fullname,
            nativeCurrency: {
                decimals: chain.nativeCurrency.decimals,
                name: chain.nativeCurrency.name,
                symbol: chain.nativeCurrency.symbol,
            },
            rpcUrls: {
                default: {
                    http: [chain.rpcUrl],
                },
            },
            blockExplorers: {
                default: { name: 'Explorer', url: chain.blockExplorerUrl },
            },
            testnet: true,
            custom: {
                chainType: [101, 102, 103].includes(chain.id) ? 'solana' : 'evm',
                network: chain.network,
                faucetUrl: chain.faucetUrl,
            },
        });
    });
}

export const chains = convertToDefineChain(particleChains.getAllChainInfos());
