'use client';

import ConnectButton from '@/connectButton';
import { useIsMounted } from '@particle-network/auth-core-modal';
import { useAccount } from 'wagmi';
import styles from './page.module.css';

export default function Home() {
    const { address, isConnected, chainId } = useAccount();

    const isMounted = useIsMounted();

    return (
        <main className={styles.main}>
            <div>
                <ConnectButton />
            </div>
            {isMounted && isConnected && (
                <div className={styles.walletInfo}>
                    <div>Address: {address}</div>
                    <div>ChainId: {chainId}</div>
                </div>
            )}
        </main>
    );
}
