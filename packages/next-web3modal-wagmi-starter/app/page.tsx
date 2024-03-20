'use client';

import ConnectButton from '@/connectButton';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import styles from './page.module.css';

const waitForElement = (selector: string) => {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                resolve(element);
            }
        }, 100);
    });
};

export default function Home() {
    const { address, isConnected, chainId } = useAccount();

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        waitForElement('w3m-modal').then(() => {
            setIsLoaded(true);
        });
    }, []);

    return (
        <main className={styles.main}>
            <div>
                <ConnectButton />
            </div>
            {isLoaded && isConnected && (
                <div className={styles.walletInfo}>
                    <div>Address: {address}</div>
                    <div>ChainId: {chainId}</div>
                </div>
            )}
        </main>
    );
}
