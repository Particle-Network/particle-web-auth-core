import { SafetyCertificateTwoTone } from '@ant-design/icons';
import { useConnect, useCustomize, useEthereum } from '@particle-network/authkit';
import { useRequest } from 'ahooks';
import { Button, message } from 'antd';
import { useEffect, useState } from 'react';
import Erc4337GasModal from '../erc4337GasModal';
import AASessionKey from './AASessionKey';
import PersonalSign from './PersonalSign';
import SendERC1155Tokens from './SendERC1155Tokens';
import SendERC20Approve from './SendERC20Approve';
import SendERC20Tokens from './SendERC20Tokens';
import ERC4337SendERC20Tokens from './SendERC20Tokens/erc4337';
import SendERC721Tokens from './SendERC721Tokens';
import SendETH from './SendETH';
import ERC4337SendETH from './SendETH/erc4337';
import SignTypedDatav4 from './SignTypedDatav4';

const EVM = () => {
    const { erc4337 } = useCustomize();
    const { chainInfo, address, enable } = useEthereum();
    const { connected } = useConnect();
    const [tron, setTron] = useState<boolean>(false);

    const { run: createWallet, loading } = useRequest(enable, {
        manual: true,
        onSuccess: () => {
            message.success('Enable success');
        },
        onError: (error: any) => {
            message.error(error.message || error);
        },
    });

    useEffect(() => {
        setTron(chainInfo.name.toLowerCase() === 'tron');
    }, [chainInfo]);

    return (
        <>
            <div className="transaction card">
                <div className="chain-title">
                    <h2 className="line-title">
                        <SafetyCertificateTwoTone /> &nbsp; EVM
                    </h2>

                    {connected && !address && (
                        <Button type="primary" onClick={createWallet} loading={loading}>
                            Enable
                        </Button>
                    )}
                </div>

                <>
                    {erc4337 ? (
                        <>
                            <ERC4337SendETH />
                            <ERC4337SendERC20Tokens />
                            {erc4337.name === 'BICONOMY' && erc4337.version === '2.0.0' && <AASessionKey />}
                        </>
                    ) : (
                        <>
                            <SendETH />
                            {!tron && (
                                <>
                                    <SendERC20Approve />
                                    <SendERC20Tokens />
                                    <SendERC721Tokens />
                                    <SendERC1155Tokens />
                                    <PersonalSign />
                                    <SignTypedDatav4 />
                                </>
                            )}
                        </>
                    )}
                </>
            </div>

            <Erc4337GasModal />
        </>
    );
};

export default EVM;
