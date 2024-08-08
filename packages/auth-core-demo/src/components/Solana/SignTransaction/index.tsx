import { ArrowIcon } from '@/components/icons';
import { useConnect, useSolana } from '@particle-network/authkit';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { Button, Input, InputNumber, notification } from 'antd';
import bs58 from 'bs58';
import { useState } from 'react';
import { isValidSolanaAddress } from '../../../utils';

function SignTransaction() {
    const defMessage = 'F4FGwoBDM8HZJjGWnhqnh5xwNssbcPgQKD4mEK1r7rjo';
    const defAmount = '0.001';
    const [loading, setLoading] = useState(0);
    const [fold, setFold] = useState(true);
    const [receiveAddress, setReceiveAddress] = useState('');
    const [amount, setAmount] = useState('');

    const { signTransaction: solanaSignTransaction, address } = useSolana();
    const { connected } = useConnect();

    const signTransaction = async () => {
        setLoading(1);
        try {
            const tx = new Transaction();
            const toAddress = receiveAddress || defMessage;
            if (!isValidSolanaAddress(toAddress)) {
                setLoading(0);
                return notification.error({
                    message: 'Please enter the correct Public key',
                });
            }
            tx.add(
                SystemProgram.transfer({
                    fromPubkey: new PublicKey(address!),
                    toPubkey: new PublicKey(toAddress),
                    lamports: amount ? Number(amount) * 1000000000 : Number(defAmount) * 1000000000,
                })
            );
            const latestBlockhash = await window.particleAuth?.solana.request({
                method: 'getLatestBlockhash',
                params: [
                    {
                        commitment: 'finalized',
                    },
                ],
            });
            const { blockhash, lastValidBlockHeight } = latestBlockhash?.value || {};
            tx.recentBlockhash = blockhash;
            tx.lastValidBlockHeight = lastValidBlockHeight;
            tx.feePayer = new PublicKey(address!);
            const result = await solanaSignTransaction(tx);
            notification.success({
                message: 'Sign Transaction Success',
                description: bs58.encode(result.signature!),
            });
        } catch (error: any) {
            notification.error({
                message: 'Sign Error',
                description: error.message,
            });
        } finally {
            setLoading(0);
        }
    };
    return (
        <div className="form-item sign-tran">
            <h3
                onClick={() => {
                    setFold(!fold);
                }}
                style={{
                    cursor: 'pointer',
                }}
            >
                Sign Transaction
                <ArrowIcon className={fold ? 'arrow-icon' : 'arrow-icon rotate'} />
            </h3>
            <div className={`fold-content ${fold ? '' : 'display'}`}>
                <div className="form-input">
                    <label>
                        <div style={{ marginBottom: 25 }}>
                            <p>Receive address</p>
                            <Input
                                onInput={(e: any) => setReceiveAddress(e.target.value)}
                                placeholder={defMessage}
                                style={{ backgroundColor: '#fff' }}
                            ></Input>
                        </div>
                    </label>

                    <label>
                        <div>
                            <p>Amount</p>
                            <InputNumber
                                min={0}
                                max={10000}
                                precision={5}
                                onChange={(e) => setAmount(e?.toString() || '')}
                                placeholder={defAmount}
                                style={{ backgroundColor: '#fff' }}
                            ></InputNumber>
                        </div>
                    </label>
                </div>

                <div className="form-submit">
                    <Button
                        loading={!!loading}
                        type="primary"
                        onClick={signTransaction}
                        disabled={!connected || !address}
                    >
                        SIGN
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SignTransaction;
