import { SafetyCertificateTwoTone } from '@ant-design/icons';
import { useConnect, useCustomize, useEthereum, useIsMounted } from '@particle-network/auth-core-modal';
import { Button, message } from 'antd';
import { useEffect, useState } from 'react';
import Erc4337GasModal from '../erc4337GasModal';
import PersonalSign from './PersonalSign';
import SendERC1155Tokens from './SendERC1155Tokens';
import SendERC20Approve from './SendERC20Approve';
import SendERC20Tokens from './SendERC20Tokens';
import ERC4337SendERC20Tokens from './SendERC20Tokens/erc4337';
import SendERC721Tokens from './SendERC721Tokens';
import SendETH from './SendETH';
import ERC4337SendETH from './SendETH/erc4337';
import SignTypedDatav4 from './SignTypedDatav4';

const { useRequest } = require('ahooks');

const EVM = () => {
    const { erc4337 } = useCustomize();
    const { chainInfo, address, enable } = useEthereum();
    const { connected } = useConnect();
    const [tron, setTron] = useState<boolean>(false);

    const mounted = useIsMounted();

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

                {mounted && (
                    <>
                        {erc4337 ? (
                            <>
                                <ERC4337SendETH />
                                <ERC4337SendERC20Tokens />
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
                )}
            </div>

            <Erc4337GasModal />
        </>
    );
};

export default EVM;
