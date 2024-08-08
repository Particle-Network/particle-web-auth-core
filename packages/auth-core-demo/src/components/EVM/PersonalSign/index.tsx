import { ArrowIcon } from '@/components/icons';
import { personalSignMessage } from '@/utils/config';
import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import { tronAddressFromHex } from '@particle-network/auth-core';
import { useConnect, useEthereum } from '@particle-network/authkit';
import { Button, Checkbox, Input, message, notification } from 'antd';
import { useState } from 'react';
import styles from './index.module.scss';

function PersonalSign() {
    const [loading, setLoading] = useState(0);
    const [fold, setFold] = useState(true);
    const [personalData, setPersonalData] = useState('');
    const [unique, setUnique] = useState(false);
    const { chainInfo, address, signMessage } = useEthereum();
    const { connected } = useConnect();

    const isTron = () => {
        return chainInfo.name.toLowerCase() === 'tron';
    };

    const personalSign = async () => {
        setLoading(1);
        try {
            // Personal Sign
            if (personalData && personalData.trim() === '') {
                throw new Error('Please enter a message');
            }

            const msg = personalData || personalSignMessage;
            const signature = await signMessage(msg, unique);
            await personalSignRecovery(signature, msg);
        } catch (error) {
            console.error('personal_sign', error);
            setLoading(0);
        } finally {
            setLoading(0);
        }
    };

    const personalSignRecovery = async (signature: string, data: string) => {
        const result = recoverPersonalSignature({
            data,
            signature,
        });
        let recoveryAddress = result;
        if (isTron()) {
            recoveryAddress = tronAddressFromHex(result);
        }
        if (recoveryAddress.toLowerCase() === address?.toLowerCase()) {
            notification.success({
                message: 'Personal Sign Success',
                description: signature,
            });
        } else {
            message.error('Personal Sign Error, Recovery Address Failed.');
        }
    };

    return (
        <div className={styles.container}>
            <div className="form-item">
                <h3
                    onClick={() => {
                        setFold(!fold);
                    }}
                    style={{
                        cursor: 'pointer',
                    }}
                >
                    Personal Sign
                    <ArrowIcon className={fold ? 'arrow-icon' : 'arrow-icon rotate'} />
                </h3>
                <div className={`fold-content ${fold ? '' : 'display'}`}>
                    <div className="form-input">
                        <label
                            style={{
                                maxWidth: '100%',
                            }}
                        >
                            <p>Message</p>
                            <Input.TextArea
                                onInput={(e: any) => setPersonalData(e.target.value)}
                                placeholder={personalSignMessage}
                                className="result-box"
                                style={{ backgroundColor: '#fff' }}
                            />
                        </label>
                    </div>

                    <div className="form-submit">
                        <Checkbox onChange={(t) => setUnique(t.target.checked)}>Unique</Checkbox>
                        <Button
                            loading={!!loading}
                            type="primary"
                            onClick={personalSign}
                            disabled={!connected || !address}
                        >
                            SIGN
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PersonalSign;
