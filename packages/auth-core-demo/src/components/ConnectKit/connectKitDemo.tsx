import { ConnectButton, useAccountInfo } from '@particle-network/connectkit';
import { isEVMProvider } from '@particle-network/connectors';
import { Button, Card, Input, message, notification } from 'antd';
import bs58 from 'bs58';
import { useState } from 'react';
import Header from '../Header';
import styles from './index.module.scss';

const ConnectKitDemo = () => {
    const [signedMessage, setSignedMessage] = useState<string>('Hello, Particle Network!');
    const { account, particleProvider } = useAccountInfo();

    const signMessage = async () => {
        if (!signedMessage) {
            message.error('Please input message!');
            return;
        }
        if (!particleProvider) {
            throw new Error('Please connect wallet first!');
        }
        try {
            let signature;
            if (isEVMProvider(particleProvider)) {
                signature = await particleProvider.request({
                    method: 'personal_sign',
                    params: [`0x${Buffer.from(signedMessage).toString('hex')}`, account],
                });
            } else {
                const result = await particleProvider.signMessage(Buffer.from(signedMessage));
                signature = bs58.encode(result);
            }
            notification.success({
                message: 'Sign Success',
                description: signature,
            });
        } catch (error: any) {
            notification.error({
                message: 'Sign Error',
                description: error.message || error,
            });
        }
    };

    return (
        <div className={styles.container}>
            <Header pathName="ConnectKit" />
            <div className={styles.connectButton}>
                <ConnectButton />
            </div>
            <div className={styles.title}>Particle ConnectKit Demo</div>

            {account && (
                <Card className={styles.card} title="Sign Message" style={{ borderRadius: 10 }}>
                    <Input.TextArea
                        style={{ borderRadius: 10 }}
                        placeholder="please input message..."
                        defaultValue={signedMessage}
                        onChange={(e) => {
                            setSignedMessage(e.target.value);
                        }}
                    />

                    <Button
                        type="primary"
                        style={{ marginTop: 10, width: '100%', borderRadius: 10 }}
                        onClick={signMessage}
                    >
                        SIGN
                    </Button>
                </Card>
            )}
        </div>
    );
};

export default ConnectKitDemo;
