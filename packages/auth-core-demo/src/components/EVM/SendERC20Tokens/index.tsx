import { ArrowIcon } from '@/components/icons';
import { toWei } from '@/utils/number-utils';
import { useConnect, useEthereum } from '@particle-network/authkit';
import { Button, Input, InputNumber, message, notification } from 'antd';
import { useState } from 'react';
import { getEVMChainInfoById, isValidEVMAddress } from '../../../utils';

function SendERC20Tokens() {
    const [loading, setLoading] = useState(0);
    const [fold, setFold] = useState(true);
    const defReceiveAddress: string = '0x6Bc8fd522354e4244531ce3D2B99f5dF2aAE335e';
    const defContractAddress: string = '0xDF27A250c425Ba6721d399bf09259e6a089D6157';
    const defErcAmount: string = '0.001';

    const [receiveAddress, setReceiveAddress] = useState<string>('');
    const [contractAddress, setContractAddress] = useState<string>('');
    const [ercAmount, setErcAmount] = useState<string>();
    const [specifiedChainId, setSpecifiedChainId] = useState<number>();
    const { sendTransaction, chainId, address } = useEthereum();
    const { connected } = useConnect();

    const sendERC20Transaction = async () => {
        setLoading(1);
        try {
            const accounts = await window.web3.eth.getAccounts();
            const from = accounts[0];
            const address = receiveAddress || defReceiveAddress;

            const amount = ercAmount || defErcAmount;
            const amountWei = toWei(amount, 'ether');
            const contract = contractAddress || defContractAddress;

            const method = 'particle_abi_encodeFunctionCall';
            const params = [contract, 'erc20_transfer', [address, amountWei]];

            if (!isValidEVMAddress(address)) {
                setLoading(0);
                return notification.error({
                    message: 'Please enter the correct receive address',
                });
            }
            if (!isValidEVMAddress(contract)) {
                setLoading(0);
                return notification.error({
                    message: 'Please enter the correct contract address',
                });
            }

            const result = await window.web3.currentProvider.request({
                method,
                params,
                from,
                chainId: specifiedChainId,
            });

            const txHash = await sendTransaction({
                to: contract,
                value: '0x0',
                data: result,
                gasLevel: 'high',
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
        } catch (e: any) {
            console.log('sendERC20Transaction', e);
            message.error(e.message ?? e);
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
                Send ERC20 Token
                <ArrowIcon className={fold ? 'arrow-icon' : 'arrow-icon rotate'} />
            </h3>
            <div className={`fold-content ${fold ? '' : 'display'}`}>
                <div className="form-input">
                    <label>
                        <p>Receive address</p>
                        <Input
                            placeholder={defReceiveAddress}
                            readOnly={!!loading}
                            // @ts-ignore
                            onInput={(e) => setReceiveAddress(e.target.value)}
                        />
                    </label>
                    <label>
                        <p>Contract address</p>
                        <Input
                            placeholder={defContractAddress}
                            readOnly={!!loading}
                            // @ts-ignore
                            onInput={(e) => setContractAddress(e.target.value)}
                        />
                    </label>
                    <label>
                        <p>Token amount</p>
                        <InputNumber
                            min={0}
                            max={10000}
                            precision={5}
                            placeholder={defErcAmount + ''}
                            readOnly={!!loading}
                            onChange={(e) => setErcAmount(e?.toString() || '')}
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
                        disabled={!connected || !address}
                        type="primary"
                        loading={loading === 1}
                        onClick={sendERC20Transaction}
                    >
                        SEND
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SendERC20Tokens;
