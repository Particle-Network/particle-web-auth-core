import { ArrowIcon } from '@/components/icons';
import { useConnect, useSolana } from '@particle-network/authkit';
import { Button, Input, notification } from 'antd';
import bs58 from 'bs58';
import { useState } from 'react';
import { personalSignMessage } from '../../../utils/config';

function SignMessage() {
    const [loading, setLoading] = useState(0);
    const [fold, setFold] = useState(true);
    const [message, setMessage] = useState('');
    const { signMessage: solanaSignMessage, address } = useSolana();

    const { connected } = useConnect();

    const signMessage = async () => {
        setLoading(1);
        try {
            const { signature } = await solanaSignMessage(Buffer.from(message || personalSignMessage));
            notification.success({
                message: 'Sign Message Success',
                description: bs58.encode(signature),
            });
        } catch (error: any) {
            notification.error({
                message: 'Sign Message Error',
                description: error.message,
            });
        } finally {
            setLoading(0);
        }
    };
    return (
        <div className="form-item sign-solana">
            <h3
                onClick={() => {
                    setFold(!fold);
                }}
                style={{
                    cursor: 'pointer',
                }}
            >
                Sign Message
                <ArrowIcon className={fold ? 'arrow-icon' : 'arrow-icon rotate'} />
            </h3>
            <div className={`fold-content ${fold ? '' : 'display'}`}>
                <div className="form-input">
                    <label>
                        <p>Message</p>
                        <Input.TextArea
                            onInput={(e: any) => setMessage(e.target.value)}
                            placeholder={personalSignMessage}
                            className="result-box"
                            style={{ backgroundColor: '#fff' }}
                        ></Input.TextArea>
                    </label>
                </div>
                <div className="form-submit">
                    <Button loading={!!loading} type="primary" onClick={signMessage} disabled={!connected || !address}>
                        SIGN
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SignMessage;
