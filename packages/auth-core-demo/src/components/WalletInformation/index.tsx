import { getEvmChains, getSolanaChains, shortString } from '@/utils/index';
import { isHexString } from '@/utils/number-utils';
import { CopyOutlined, PlusSquareOutlined, RedoOutlined } from '@ant-design/icons';
import { tronAddressToHex } from '@particle-network/auth-core';
import {
    getEVMPublicAddress,
    useAuthCore,
    useConnect,
    useCustomize,
    useEthereum,
    useSolana,
} from '@particle-network/authkit';
import { Badge, Button, Select, message } from 'antd';
import { ethers } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import aaOptions from '../../config/erc4337';

const { useRequest } = require('ahooks');

export const WalletInformation = () => {
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [balance, setBalance] = useState<number | string>(0);
    const [solanaBalance, setSolanaBalance] = useState<number | string>(0);

    const { disconnect } = useConnect();

    const { address, chainInfo, switchChain, provider } = useEthereum();
    const [evmAddress, setEvmAddress] = useState<string | null>(address);
    const { address: solanaAddress, chainInfo: solanaChainInfo, switchChain: solanaSwitchChain } = useSolana();
    const {
        userInfo,
        needRestoreWallet,
        openAccountAndSecurity,
        openSetMasterPassword,
        openChangeMasterPassword,
        openRestoreByMasterPassword,
        openSetPaymentPassword,
        openChangePaymentPassword,
        openSetSecurityAccount,
        openLinkLoginAccount,
        openWallet,
        openBuy,
    } = useAuthCore();

    const { erc4337, fiatCoin } = useCustomize();

    const openWindow = (url: string | URL | undefined) => window.open(url);
    const logout = async () => {
        setLogoutLoading(true);
        try {
            await disconnect();
        } catch (error) {
            console.log('logout', error);
        }
        setLogoutLoading(false);
    };

    const getBalance = async () => {
        setBalance(0);
        if (evmAddress) {
            try {
                const result = await provider.request({
                    chainId: chainInfo.id,
                    method: 'eth_getBalance',
                    params: [isHexString(evmAddress) ? evmAddress : tronAddressToHex(evmAddress), 'latest'],
                });
                setBalance(ethers.formatUnits(result, chainInfo.name === 'Tron' ? 6 : 18));
            } catch (error: any) {
                console.error('getBalance error', error);
                message.error(error.message || error);
            }
        }
    };

    const getSolanaBalance = async () => {
        setSolanaBalance(0);
        try {
            const result = await window.particleAuth?.solana.request({
                method: 'getBalance',
                params: [solanaAddress],
            });

            setSolanaBalance(ethers.formatUnits(result.value, 9));
        } catch (error: any) {
            message.error(error.message || error);
        }
    };

    useEffect(() => {
        if (evmAddress) {
            getBalance();
        }
    }, [chainInfo, evmAddress]);

    useEffect(() => {
        if (solanaAddress) {
            getSolanaBalance();
        }
    }, [solanaChainInfo, solanaAddress]);

    const aaNetworkConfig = useMemo(() => {
        if (!erc4337) {
            return [];
        } else {
            const version = erc4337.version || '1.0.0';
            return (
                aaOptions.accountContracts[erc4337.name as keyof typeof aaOptions.accountContracts].find(
                    (item) => item.version === version
                )?.chainIds || []
            );
        }
    }, [erc4337]);

    useEffect(() => {
        if (address) {
            let erc4337Config;
            if (erc4337 && aaNetworkConfig.includes(chainInfo.id)) {
                erc4337Config = erc4337;
            }
            getEVMPublicAddress({
                chainId: chainInfo.id,
                erc4337: erc4337Config,
            })
                .then((result: string) => setEvmAddress(result))
                .catch((error: any) => {
                    console.log('getEVMPublicAddress error', error);
                });
        } else {
            setEvmAddress(null);
        }
    }, [address, erc4337, chainInfo, aaNetworkConfig]);

    // const chainOptions = useMemo(() => {
    //     const options = getAllChainInfos().filter((item) => item.name !== 'Solana');
    //     if (erc4337) {
    //         return options.filter((item) => item.chainType === 'evm' && aaNetworkConfig.includes(item.id));
    //     }
    //     return options;
    // }, [erc4337, aaNetworkConfig]);

    const { run: runSwitchChain, loading: switchChainLoading } = useRequest(switchChain, {
        manual: true,
        onError: (error: any) => {
            message.error(error.message || error);
        },
    });

    const { run: runSolanaSwitchChain, loading: solanaSwitchChainLoading } = useRequest(solanaSwitchChain, {
        manual: true,
        onError: (error: any) => {
            message.error(error.message || error);
        },
    });

    const evmChians = useMemo(() => {
        return getEvmChains();
    }, []);

    const solanaChains = useMemo(() => {
        return getSolanaChains();
    }, []);

    return (
        <div className="login-box card">
            <h2 className="login-box-title">Wallet Information</h2>
            {evmAddress && (
                <>
                    <h3>
                        <span className="login-label" style={{ height: 32, lineHeight: 2 }}>
                            EVM Chain:
                        </span>
                        <Select
                            value={`${chainInfo.name}-${chainInfo.id}`}
                            onChange={(value) => {
                                runSwitchChain(value);
                            }}
                            style={{
                                width: 190,
                                textAlign: 'center',
                            }}
                            loading={switchChainLoading}
                            showSearch
                            filterOption={(input, option) => {
                                return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
                            }}
                            options={evmChians.map((item) => ({
                                ...item,
                                label: item.name,
                                value: item.id,
                            }))}
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        />
                    </h3>
                    <h3>
                        <span className="login-label">EVM Address:</span>
                        <span
                            style={{ color: '#1890ff', cursor: 'pointer' }}
                            onClick={() => {
                                navigator.clipboard.writeText(evmAddress as string);
                                message.success('Copied to clipboard');
                            }}
                        >
                            {shortString(evmAddress)}
                            <CopyOutlined style={{ marginLeft: 4 }} />
                        </span>
                    </h3>
                    <h3>
                        <span className="login-label">Balance:</span>
                        <span>
                            {balance} {chainInfo.nativeCurrency.symbol}
                            <RedoOutlined
                                onClick={() => getBalance()}
                                style={{ marginLeft: 5, color: '#1890ff', cursor: 'pointer' }}
                            />
                            {!!chainInfo?.custom?.faucetUrl && (
                                <PlusSquareOutlined
                                    onClick={() => openWindow((chainInfo?.custom?.faucetUrl || '') as string)}
                                    style={{ marginLeft: 10, color: '#1890ff', cursor: 'pointer' }}
                                />
                            )}
                        </span>
                    </h3>
                </>
            )}

            {evmAddress && solanaAddress && <br />}

            {solanaAddress && (
                <>
                    <h3>
                        <span className="login-label" style={{ height: 32, lineHeight: 2 }}>
                            Solana Chain:
                        </span>
                        <Select
                            value={`${solanaChainInfo.name}-${solanaChainInfo.id}`}
                            onChange={(value) => {
                                runSolanaSwitchChain(value);
                            }}
                            style={{
                                width: 190,
                                textAlign: 'center',
                            }}
                            loading={solanaSwitchChainLoading}
                            showSearch
                            filterOption={(input, option) => {
                                return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
                            }}
                            options={solanaChains.map((item) => ({
                                ...item,
                                label: item.name,
                                value: item.id,
                            }))}
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        ></Select>
                    </h3>
                    <h3>
                        <span className="login-label">Solana Address:</span>
                        <span
                            style={{ color: '#1890ff', cursor: 'pointer' }}
                            onClick={() => {
                                navigator.clipboard.writeText(solanaAddress as string);
                                message.success('Copied to clipboard');
                            }}
                        >
                            {shortString(solanaAddress)}
                            <CopyOutlined style={{ marginLeft: 4 }} />
                        </span>
                    </h3>
                    <h3>
                        <span className="login-label">Balance:</span>
                        <span>
                            {solanaBalance} {solanaChainInfo.nativeCurrency.symbol}
                            <RedoOutlined
                                onClick={() => getSolanaBalance()}
                                style={{ marginLeft: 5, color: '#1890ff', cursor: 'pointer' }}
                            />
                            {!!solanaChainInfo.custom?.faucetUrl && (
                                <PlusSquareOutlined
                                    onClick={() => openWindow((solanaChainInfo.custom?.faucetUrl || '') as string)}
                                    style={{ marginLeft: 10, color: '#1890ff', cursor: 'pointer' }}
                                />
                            )}
                        </span>
                    </h3>
                </>
            )}

            <br />

            <div className="center-center flex-column">
                <div className="button-group">
                    <Button
                        type="primary"
                        className="login-button"
                        onClick={() => {
                            openBuy({
                                network: chainInfo.name,
                                fiatCoin: fiatCoin || 'USD',
                                cryptoCoin: chainInfo?.nativeCurrency?.symbol || 'eth',
                                walletAddress: evmAddress as string,
                            });
                        }}
                    >
                        Buy
                    </Button>
                </div>
                <div className="button-group">
                    <Button
                        type="primary"
                        className="login-button"
                        onClick={() => {
                            openWallet({
                                topMenuType: 'close',
                            });
                        }}
                    >
                        Wallet
                    </Button>
                </div>
                <div className="button-group">
                    <Button
                        type="primary"
                        className="login-button"
                        onClick={() => {
                            try {
                                openAccountAndSecurity();
                            } catch (error: any) {
                                message.error(error.message || error);
                            }
                        }}
                    >
                        Account And Security
                        {(!userInfo?.security_account.has_set_master_password ||
                            !userInfo?.security_account.has_set_payment_password) && <Badge dot={true}></Badge>}
                    </Button>
                </div>

                {!userInfo?.security_account.has_set_master_password && (
                    <Button
                        type="primary"
                        className="login-button"
                        onClick={() => {
                            try {
                                openSetMasterPassword();
                            } catch (error: any) {
                                message.error(error.message || error);
                            }
                        }}
                    >
                        Set Master Password
                    </Button>
                )}

                {userInfo?.security_account.has_set_master_password && (
                    <Button
                        type="primary"
                        className="login-button"
                        onClick={() => {
                            try {
                                openChangeMasterPassword();
                            } catch (error: any) {
                                message.error(error.message || error);
                            }
                        }}
                    >
                        Change Master Password
                    </Button>
                )}

                {userInfo && needRestoreWallet && (
                    <Button
                        type="primary"
                        className="login-button"
                        onClick={() => {
                            try {
                                openRestoreByMasterPassword();
                            } catch (error: any) {
                                message.error(error.message || error);
                            }
                        }}
                    >
                        Restore Wallet
                    </Button>
                )}

                {userInfo && !userInfo.security_account.has_set_payment_password && (
                    <Button
                        type="primary"
                        className="login-button"
                        onClick={() => {
                            if (userInfo.security_account.email || userInfo.security_account.phone) {
                                openSetPaymentPassword(
                                    userInfo.security_account.email || userInfo.security_account.phone!
                                );
                            } else {
                                message.warning('Please set security account first');
                            }
                        }}
                    >
                        Set Payment Password
                    </Button>
                )}

                {userInfo?.security_account.has_set_payment_password && (
                    <Button type="primary" className="login-button" onClick={openChangePaymentPassword}>
                        Change Payment Password
                    </Button>
                )}

                {(!userInfo?.security_account.email || !userInfo?.security_account.phone) && (
                    <Button type="primary" className="login-button" onClick={openSetSecurityAccount}>
                        Set Security Account
                    </Button>
                )}

                {(userInfo?.security_account.email || userInfo?.security_account.phone) && (
                    <Button type="primary" className="login-button" onClick={openLinkLoginAccount}>
                        Link Login Account
                    </Button>
                )}

                <Button loading={logoutLoading} type="primary" danger className="login-button" onClick={logout}>
                    Disconnect
                </Button>
            </div>
        </div>
    );
};
