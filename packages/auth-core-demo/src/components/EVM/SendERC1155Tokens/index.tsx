import { ArrowIcon } from '@/components/icons';
import { useConnect, useEthereum } from '@particle-network/authkit';
import { Button, Input, InputNumber, message, notification } from 'antd';
import { useState } from 'react';
import { getEVMChainInfoById, isValidEVMAddress } from '../../../utils';

function SendERC1155Tokens() {
    const defReceiveAddress: string = '0x329a7f8b91Ce7479035cb1B5D62AB41845830Ce8';
    const defContractAddress: string = '0xcCe924184139a75d312BD8CCE9df55d5f66F08e3';
    const defErcAmount: number = 1;
    const defTokenId = '4';

    const [loading, setLoading] = useState(0);
    const [fold, setFold] = useState(true);
    const [tokenId, setTokenId] = useState(defTokenId);
    const [receiveAddress, setReceiveAddress] = useState<string>('');
    const [contractAddress, setContractAddress] = useState<string>('');
    const [ercAmount, setErcAmount] = useState(defErcAmount);
    const [specifiedChainId, setSpecifiedChainId] = useState<number>();
    const { chainId, sendTransaction, address } = useEthereum();

    const { connected } = useConnect();

    const sendERC1155Transaction = async () => {
        console.log('sendERC1155Transaction', tokenId, ercAmount);
        setLoading(1);
        try {
            const accounts = await window.web3.eth.getAccounts();
            const from = accounts[0];
            const method = 'particle_abi_encodeFunctionCall';
            const address = receiveAddress || defReceiveAddress;
            const amount = Number(ercAmount) || defErcAmount;
            const contract = contractAddress || defContractAddress;
            if (!isValidEVMAddress(address)) {
                setLoading(0);
                return notification.error({
                    message: 'Please enter the correct address',
                });
            }

            if (!isValidEVMAddress(contract)) {
                setLoading(0);
                return notification.error({
                    message: 'Please enter the correct contract address',
                });
            }
            const id = tokenId;

            const params = [contract, 'erc1155_safeTransferFrom', [from, address, id, amount, '0x0']];

            //@ts-ignore
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
                chainId: specifiedChainId,
                gasLevel: 'high',
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
            setLoading(0);
            console.log('sendERC1155Transaction', e);
            message.error(e?.message ?? e);
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
                Send ERC1155 Token
                <ArrowIcon className={fold ? 'arrow-icon' : 'arrow-icon rotate'} />
            </h3>
            <div className={`fold-content ${fold ? '' : 'display'}`}>
                <div className="form-input">
                    <label>
                        <p>Receive address</p>
                        <Input
                            className="input"
                            placeholder={defReceiveAddress}
                            readOnly={!!loading}
                            // @ts-ignore
                            onInput={(e) => setReceiveAddress(e.target.value)}
                        />
                    </label>
                    <label>
                        <p>Contract address</p>
                        <Input
                            className="input"
                            placeholder={defContractAddress}
                            readOnly={!!loading}
                            // @ts-ignore
                            onInput={(e) => setContractAddress(e.target.value)}
                        />
                    </label>
                    <label>
                        <p>Token ID</p>
                        <InputNumber
                            min={0}
                            max={10000}
                            precision={0}
                            className="input"
                            placeholder={defTokenId}
                            readOnly={!!loading}
                            onChange={(e: any) => {
                                setTokenId(e?.toString());
                            }}
                        ></InputNumber>
                    </label>

                    <label>
                        <p>Token amount</p>
                        <InputNumber
                            precision={0}
                            min={0}
                            max={10000}
                            className="input"
                            placeholder={defErcAmount + ''}
                            readOnly={!!loading}
                            onChange={(e: any) => setErcAmount(Number(e))}
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
                        onClick={sendERC1155Transaction}
                    >
                        SEND
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SendERC1155Tokens;
