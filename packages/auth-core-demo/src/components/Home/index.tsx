import EVM from '@/components/EVM';
import { DiscordIcon } from '@/components/icons';
import { openWindow } from '@/utils/index';
import {
    AndroidOutlined,
    AppleOutlined,
    ContainerOutlined,
    DesktopOutlined,
    ScanOutlined,
    TwitterOutlined,
} from '@ant-design/icons';
import { AAWrapProvider, SendTransactionMode, SmartAccount } from '@particle-network/aa';
import { type UserInfo } from '@particle-network/auth-core';
import { useConnect, useCustomize, useEthereum } from '@particle-network/auth-core-modal';
import { Popover, Skeleton, Tag, message } from 'antd';
import { isServer } from 'pages/_app';
import QRCode from 'qrcode.react';
import { useEffect } from 'react';
import Web3 from 'web3';
import aaOptions from '../../config/erc4337';
import { ConnectDashboard } from '../ConnectDashboard';
import DemoSetting from '../DemoSetting';
import Header from '../Header';
import Solana from '../Solana';
import { WalletInformation } from '../WalletInformation';

import styles from './index.module.scss';

function Home() {
    const { connected, connectionStatus, setSocialConnectCallback } = useConnect();

    const { provider } = useEthereum();

    const { erc4337 } = useCustomize();

    useEffect(() => {
        setSocialConnectCallback({
            onError: (error: any) => {
                console.log('SocialConnectCallback onError', error);
                message.error(error.message);
            },
            onSuccess: (info: UserInfo) => {
                console.log('SocialConnectCallback onSuccess', info);
            },
        });
        return () => {
            setSocialConnectCallback(undefined);
        };
    }, []);

    useEffect(() => {
        if (erc4337) {
            if (!window.smartAccount) {
                window.smartAccount = new SmartAccount(provider, {
                    projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
                    clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY as string,
                    appId: process.env.NEXT_PUBLIC_APP_ID as string,
                    aaOptions,
                });
                window.web3 = new Web3(new AAWrapProvider(window.smartAccount, SendTransactionMode.UserSelect) as any);
            }
            window.smartAccount.setSmartAccountContract(erc4337);
        } else {
            window.web3 = new Web3(provider as any);
        }
    }, [provider, erc4337]);

    return (
        <div className={styles.indexContainer}>
            <Header />
            <div className="app-container">
                <div className="content-container">
                    <div className="logo-box card">
                        <h2 className="card-title">Particle Network</h2>
                        <h4 className="card-title2">
                            Full-stack Web3 infrastructure provider, To see some running examples of Particle Network,
                            or even use them to automatically scaffold a new project, check out the
                            <a href="https://github.com/Particle-Network/particle-web-auth-core"> official examples</a>.
                        </h4>

                        <div className="link-box">
                            <Tag
                                className="link-tag"
                                icon={<DesktopOutlined />}
                                color="#d242ca"
                                onClick={() => openWindow(' https://particle.network')}
                            >
                                Official Website
                            </Tag>
                            <Tag
                                className="link-tag"
                                icon={<ContainerOutlined />}
                                color="#1890ff"
                                onClick={() => openWindow(' https://docs.particle.network')}
                            >
                                Developer Docs
                            </Tag>
                            <Tag
                                className="link-tag"
                                icon={<TwitterOutlined />}
                                color="#55acee"
                                onClick={() => openWindow('https://twitter.com/ParticleNtwrk')}
                            >
                                Twitter
                            </Tag>

                            <Tag
                                className="link-tag"
                                icon={<DiscordIcon style={{ color: '#fff' }} />}
                                color="#5865f2"
                                onClick={() => openWindow('https://discord.com/invite/2y44qr6CR2')}
                            >
                                Discord
                            </Tag>
                        </div>
                    </div>

                    <div className="download-box card">
                        <h2 className="card-title" style={{ fontSize: 20 }}>
                            Download Demo
                        </h2>
                        <div className="link-box">
                            <Tag
                                className="link-tag"
                                icon={<AppleOutlined />}
                                color="#000"
                                onClick={() =>
                                    openWindow('https://apps.apple.com/us/app/particle-crypto-wallet/id1632425771')
                                }
                            >
                                Apple Store
                            </Tag>
                            <Tag
                                className="link-tag"
                                icon={<AndroidOutlined />}
                                color="#000"
                                onClick={() =>
                                    openWindow('https://play.google.com/store/apps/details?id=network.particle.auth')
                                }
                            >
                                Google Play
                            </Tag>

                            <Popover
                                content={
                                    <QRCode size={100} value={isServer() ? '' : window.location.origin + '/qrcode'} />
                                }
                                trigger="click"
                            >
                                <Tag className="link-tag" icon={<ScanOutlined />} color="#000">
                                    <> QR Code</>
                                </Tag>
                            </Popover>
                        </div>
                    </div>

                    <div className="right-container">
                        <Skeleton loading={connectionStatus === 'loading'} active paragraph={{ rows: 12 }} title>
                            {connected ? <WalletInformation /> : <ConnectDashboard />}
                        </Skeleton>
                        <DemoSetting />
                    </div>
                    <EVM />
                    <Solana />
                </div>
            </div>
        </div>
    );
}

export default Home;
