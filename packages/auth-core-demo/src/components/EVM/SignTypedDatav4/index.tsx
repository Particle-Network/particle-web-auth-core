import { ArrowIcon } from '@/components/icons';
import { SignTypedDataVersion, recoverTypedSignature } from '@metamask/eth-sig-util';
import { tronAddressFromHex } from '@particle-network/auth-core';
import { useConnect, useEthereum } from '@particle-network/auth-core-modal';
import { Button, Checkbox, Input, message, notification } from 'antd';
import { useState } from 'react';
import { isJson } from '../../../utils';
import { typedData } from './data';

function SignTypedDatav4() {
    const [loading, setLoading] = useState(0);
    const [fold, setFold] = useState(true);
    const [msg, setMsg] = useState('');
    const [unique, setUnique] = useState(false);
    const { signTypedData, chainInfo, address } = useEthereum();
    const { connected } = useConnect();

    const signTypedDataV4 = async () => {
        setLoading(1);
        try {
            if (msg && !isJson(msg)) {
                throw new Error('Failed to verify json');
            }
            setLoading(1);

            const data = msg ? JSON.parse(msg) : typedData;
            const signature = await signTypedData({
                data,
                version: SignTypedDataVersion.V4,
                uniq: unique,
            });
            signTypedDataV4Recovery(signature, data);
        } catch (error: any) {
            console.log('signTypedData_v4 error', error);
            message.error(error.message);
        } finally {
            setLoading(0);
        }
    };

    const signTypedDataV4Recovery = (signature: string, data: any) => {
        const result = recoverTypedSignature({
            data,
            signature,
            version: SignTypedDataVersion.V4,
        });
        let recoveryAddress = result;
        if (chainInfo.name.toLowerCase() === 'tron') {
            recoveryAddress = tronAddressFromHex(result);
        }
        if (recoveryAddress.toLowerCase() === address?.toLowerCase()) {
            notification.success({
                message: 'Sign Typed Data Success',
                description: signature,
            });
        } else {
            message.error('Sign Typed Data Error, Recovery Address Failed.');
        }
    };

    return (
        <div className="form-item">
            <h3
                onClick={() => {
                    setFold(!fold);
                }}
                style={{
                    cursor: 'pointer',
                }}
            >
                Sign Typed Data
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
                            onInput={(e: any) => setMsg(e.target.value)}
                            placeholder={JSON.stringify(typedData, null, 2)}
                            className="result-box"
                            style={{ backgroundColor: '#fff' }}
                        ></Input.TextArea>
                    </label>
                </div>

                <div className="form-submit">
                    <Checkbox className="uniq-checkbox" onChange={(t) => setUnique(t.target.checked)}>
                        Unique
                    </Checkbox>
                    <Button loading={!!loading} type="primary" onClick={signTypedDataV4} disabled={!connected}>
                        SIGN
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SignTypedDatav4;
