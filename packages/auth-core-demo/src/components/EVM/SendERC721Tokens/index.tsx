import { ArrowIcon } from '@/components/icons';
import { useConnect, useEthereum } from '@particle-network/auth-core-modal';
import { chains } from '@particle-network/chains';
import { Button, Input, InputNumber, message, notification } from 'antd';
import { useState } from 'react';
import { isValidEVMAddress } from '../../../utils';

function SendERC721Tokens() {
    const defReceiveAddress: string = '0x6Bc8fd522354e4244531ce3D2B99f5dF2aAE335e';
    const defContractAddress: string = '0xDF27A250c425Ba6721d399bf09259e6a089D6157';
    const defTokenId = '1';

    const [loading, setLoading] = useState(0);
    const [fold, setFold] = useState(true);
    const [receiveAddress, setReceiveAddress] = useState<string>('');
    const [contractAddress, setContractAddress] = useState<string>('');
    const [tokenId, setTokenId] = useState<string>(defTokenId);
    const [specifiedChainId, setSpecifiedChainId] = useState<number>();
    const { chainId, sendTransaction } = useEthereum();

    const { connected } = useConnect();

    const sendERC721Transaction = async () => {
        setLoading(1);
        try {
            const accounts = await window.web3.eth.getAccounts();
            const from = accounts[0];
            const address = receiveAddress || defReceiveAddress;
            const contract = contractAddress || defContractAddress;

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
            const method = 'particle_abi_encodeFunctionCall';
            const params = [contract, 'erc721_safeTransferFrom', [from, address, tokenId]];

            const result = await (window.web3.currentProvider as any).request({
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
            const chainInfo = chains.getEVMChainInfoById(specifiedChainId || chainId);
            notification.success({
                message: 'Send Transaction Success',
                description: txHash,
                onClick: () => {
                    window.open(`${chainInfo?.blockExplorerUrl}/tx/${txHash}`);
                },
            });
        } catch (e: any) {
            console.log('sendERC721Transaction', e);
            message.error(e.message ?? e);
            setLoading(0);
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
                Send ERC721 Token
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
                            precision={0}
                            min={0}
                            max={10000}
                            className="input"
                            placeholder={defTokenId}
                            readOnly={!!loading}
                            onChange={(e: any) => setTokenId(e?.toString())}
                        ></InputNumber>
                    </label>

                    <label>
                        <p>Chain ID (optional)</p>
                        <InputNumber
                            min={1}
                            placeholder={chainId.toString()}
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
                        disabled={!connected}
                        type="primary"
                        loading={loading === 1}
                        onClick={sendERC721Transaction}
                    >
                        SEND
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SendERC721Tokens;
