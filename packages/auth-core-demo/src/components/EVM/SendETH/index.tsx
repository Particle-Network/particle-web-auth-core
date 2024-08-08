import { ArrowIcon } from '@/components/icons';
import { getEVMChainInfoById } from '@/utils/index';
import { toHex, toWei } from '@/utils/number-utils';
import { GasFeeMode, tronAddressFromHex } from '@particle-network/auth-core';
import { useConnect, useEthereum } from '@particle-network/authkit';
import { chains } from '@particle-network/chains';
import { Button, Input, InputNumber, message, notification } from 'antd';
import { useMemo, useState } from 'react';

function SendETH() {
    const [loading, setLoading] = useState<number>(0);
    const [fold, setFold] = useState(true);
    const defEthAmount: string = '0.001';
    const [receiveAddress, setReceiveAddress] = useState<string>('');
    const [ethAmount, setEthAmount] = useState<string>('');
    const { chainInfo, sendTransaction, chainId, address } = useEthereum();

    const [specifiedChainId, setSpecifiedChainId] = useState<number>();

    const { connected } = useConnect();

    const isTron = () => {
        return chainInfo.name.toLowerCase() === 'tron';
    };

    const defReceiveAddress = useMemo(() => {
        return isTron()
            ? tronAddressFromHex('0x6Bc8fd522354e4244531ce3D2B99f5dF2aAE335e')
            : '0x6Bc8fd522354e4244531ce3D2B99f5dF2aAE335e';
    }, [chainInfo]);

    const isSupportEIP1559 = () => {
        return chains.isChainSupportEIP1559(chainInfo);
    };
    const sendTransactionHandler = async () => {
        setLoading(1);
        try {
            const address = receiveAddress || defReceiveAddress;
            const amount = ethAmount || defEthAmount;
            const amountWei = toWei(amount, isTron() ? 'mwei' : 'ether');
            const txHash = await sendTransaction({
                to: address,
                value: toHex(amountWei),
                type: '0x0',
                chainId: specifiedChainId,
                gasLevel: GasFeeMode.high,
            });
            const chainInfo = getEVMChainInfoById(specifiedChainId || chainId);
            notification.success({
                message: 'Send Transaction Success',
                description: txHash,
                onClick: () => {
                    window.open(`${chainInfo?.blockExplorers?.default.url}/tx/${txHash}`);
                },
            });
        } catch (error: any) {
            message.error(error.message || error);
        } finally {
            setLoading(0);
        }
    };

    const sendEIP1559TransactionHandler = async () => {
        setLoading(2);
        try {
            const address = receiveAddress || defReceiveAddress;
            const amount = ethAmount || defEthAmount;
            const amountWei = toWei(amount, isTron() ? 'mwei' : 'ether');
            const txHash = await sendTransaction({
                to: address,
                value: toHex(amountWei),
                type: '0x2',
                chainId: specifiedChainId,
            });
            const chainInfo = getEVMChainInfoById(specifiedChainId || chainId);
            notification.success({
                message: 'Send Transaction Success',
                description: txHash,
                onClick: () => {
                    window.open(`${chainInfo?.blockExplorers?.default.url}/tx/${txHash}`);
                },
            });
        } catch (error: any) {
            message.error(error.message || error);
        }
        setLoading(0);
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
                Send Native Token
                <ArrowIcon className={fold ? 'arrow-icon' : 'arrow-icon rotate'} />
            </h3>
            <div className={`fold-content ${fold ? '' : 'display'}`}>
                <div className="form-input">
                    <label>
                        <p>Receive address</p>
                        <Input
                            placeholder={defReceiveAddress}
                            readOnly={!!loading}
                            onInput={(e: any) => setReceiveAddress(e.target?.value)}
                        />
                    </label>
                    <label>
                        <p>Token amount</p>
                        <InputNumber
                            min={0}
                            max={10000}
                            placeholder={defEthAmount}
                            precision={5}
                            readOnly={!!loading}
                            onChange={(e: any) => setEthAmount(e?.toString())}
                        ></InputNumber>
                    </label>

                    <label>
                        <p>Chain ID (optional)</p>
                        <InputNumber
                            min={1}
                            placeholder="Send the transaction to the specified chain"
                            precision={0}
                            readOnly={!!loading}
                            onChange={(e: any) => {
                                if (e) {
                                    setSpecifiedChainId(Number(e.toFixed(0)));
                                } else {
                                    setSpecifiedChainId(undefined);
                                }
                            }}
                        ></InputNumber>
                    </label>
                </div>

                <div className="form-submit">
                    <Button
                        type="primary"
                        loading={loading === 1}
                        onClick={sendTransactionHandler}
                        disabled={!connected || !address}
                    >
                        SEND TRANSACTION
                    </Button>

                    {isSupportEIP1559() && (
                        <Button
                            type="primary"
                            loading={loading === 2}
                            onClick={sendEIP1559TransactionHandler}
                            disabled={!connected || !address}
                        >
                            SEND EIP1559 TRANSACTION
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SendETH;
