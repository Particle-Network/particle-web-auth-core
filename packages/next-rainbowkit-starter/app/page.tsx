'use client';

import { particleWagmiWallet } from '@/particleWallet/particleWagmiWallet';
import { useConnect as useParticleConnect, useUserInfo } from '@particle-network/auth-core-modal';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { useEffect } from 'react';
import { useConnect } from 'wagmi';
import styles from './page.module.css';

export default function Home() {
    // start: fix social auth login
    const { connect } = useConnect();
    const { connectionStatus } = useParticleConnect();
    const { userInfo } = useUserInfo();

    useEffect(() => {
        if (
            connectionStatus === 'connected' &&
            userInfo &&
            userInfo?.thirdparty_user_info?.provider !== 'email' &&
            userInfo?.thirdparty_user_info?.provider !== 'phone' &&
            userInfo?.thirdparty_user_info?.provider !== 'jwt'
        ) {
            connect({
                connector: particleWagmiWallet({ socialType: userInfo?.thirdparty_user_info?.provider as any }),
            });
        }
    }, [userInfo, connect, connectionStatus]);
    // end: fix social auth login

    return (
        <main className={styles.main}>
            <div className={styles.description}>
                <p>
                    Get started by editing&nbsp;
                    <code className={styles.code}>app/page.tsx</code>
                </p>
                <div>
                    <a
                        href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        By{' '}
                        <Image
                            src="/vercel.svg"
                            alt="Vercel Logo"
                            className={styles.vercelLogo}
                            width={100}
                            height={24}
                            priority
                        />
                    </a>
                </div>
            </div>

            <div className={styles.center}>
                <ConnectButton></ConnectButton>
            </div>

            <div className={styles.grid}>
                <a
                    href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                    className={styles.card}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2>
                        Docs <span>-&gt;</span>
                    </h2>
                    <p>Find in-depth information about Next.js features and API.</p>
                </a>

                <a
                    href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                    className={styles.card}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2>
                        Learn <span>-&gt;</span>
                    </h2>
                    <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
                </a>

                <a
                    href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                    className={styles.card}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2>
                        Templates <span>-&gt;</span>
                    </h2>
                    <p>Explore starter templates for Next.js.</p>
                </a>

                <a
                    href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                    className={styles.card}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2>
                        Deploy <span>-&gt;</span>
                    </h2>
                    <p>Instantly deploy your Next.js site to a shareable URL with Vercel.</p>
                </a>
            </div>
        </main>
    );
}
