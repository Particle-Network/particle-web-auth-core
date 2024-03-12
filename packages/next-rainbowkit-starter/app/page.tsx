'use client';

import { particleWagmiWallet } from '@/particleWallet/particleWagmiWallet';
import {
    AuthCoreEvent,
    getLatestAuthType,
    isSocialAuthType,
    particleAuth,
    type SocialAuthType,
} from '@particle-network/auth-core';
import { useConnect as useParticleConnect } from '@particle-network/auth-core-modal';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';
import { useConnect, useDisconnect } from 'wagmi';
import styles from './page.module.css';

export default function Home() {
    // start: fix social auth login
    const { connect } = useConnect();
    const { connectionStatus } = useParticleConnect();
    const { disconnect } = useDisconnect();

    useEffect(() => {
        if (connectionStatus === 'connected' && isSocialAuthType(getLatestAuthType())) {
            connect({
                connector: particleWagmiWallet({ socialType: getLatestAuthType() as SocialAuthType }),
            });
        }
        const onDisconnect = () => {
            disconnect();
        };
        particleAuth.on(AuthCoreEvent.ParticleAuthDisconnect, onDisconnect);
        return () => {
            particleAuth.off(AuthCoreEvent.ParticleAuthDisconnect, onDisconnect);
        };
    }, [connect, connectionStatus, disconnect]);
    // end: fix social auth login

    return (
        <main className={styles.main}>
            <ConnectButton></ConnectButton>
        </main>
    );
}
