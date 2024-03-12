'use client';

import ConnectButton from '@/connectButton';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import styles from './page.module.css';

export default function Home() {
    const { address, chainId, isConnected } = useWeb3ModalAccount();

    return (
        <main className={styles.main}>
            <ConnectButton />

            {isConnected && (
                <div className={styles.walletInfo}>
                    <div>Address: {address}</div>
                    <div>ChainId: {chainId}</div>
                </div>
            )}
        </main>
    );
}
