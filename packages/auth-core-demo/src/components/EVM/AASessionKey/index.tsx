import { ArrowIcon } from '@/components/icons';
import events from '@/utils/eventBus';
import { isMobile, shortString } from '@/utils/index';
import type { CreateSessionKeyOptions, SessionKey, UserOpBundle, UserOpParams } from '@particle-network/aa';
import { useConnect, useCustomize, useEthereum } from '@particle-network/auth-core-modal';
import { ComboTestnet, PolygonMumbai } from '@particle-network/chains';
import { useRequest } from 'ahooks';
import { Button, Space, Table, message, notification } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Interface, Wallet, getBytes } from 'ethers';
import { useEffect, useMemo, useState } from 'react';

type LocalSession = {
    signer: {
        privateKey: string;
        address: string;
    };
    sessions: SessionKey[];
};

type SessionData = {
    [key: string]: LocalSession;
};

interface DataType {
    key: string;
    address: string;
    localSession: LocalSession;
}

const erc1155MintToModuleAddr = '0x8E09744b738e9Fec4A4df7Ab5621f1857F6Fa175';
const erc1155TokenAddress = '0x909E30bdBCb728131E3F8d17150eaE740C904649';

const AASessionKey = () => {
    const [fold, setFold] = useState(true);

    const { chainInfo, address } = useEthereum();

    const { connected } = useConnect();

    const { erc4337 } = useCustomize();

    const [localSessions, setLocalSessions] = useState<LocalSession[]>();

    const { loading: createSessionsLoading, run: runCreateSessions } = useRequest(
        async (chainId: number, localSessions: LocalSession[]): Promise<string> => {
            const sessionSigner = Wallet.createRandom();
            const address = await window.smartAccount.getAddress();

            const options: CreateSessionKeyOptions[] = [
                {
                    validUntil: 0,
                    validAfter: 0,
                    sessionValidationModule: erc1155MintToModuleAddr,
                    sessionKeyDataInAbi: [
                        ['address', 'address', 'uint256'],
                        [
                            sessionSigner.address,
                            address, // receiver address
                            1,
                        ],
                    ],
                },
                ...localSessions.map((item) => item.sessions[0]),
            ];
            const feeQuotesResult = await window.smartAccount.createSessions(options);

            const txHash = await new Promise<string>((resolve, reject) => {
                events.removeAllListeners('erc4337:sendTransaction');
                events.removeAllListeners('erc4337:sendTransactionError');
                events.once('erc4337:sendTransaction', async (params: any) => {
                    try {
                        if (params.feeQuote) {
                            const hash = await window.smartAccount.sendTransaction({
                                ...params,
                                tx: feeQuotesResult.transactions,
                            });
                            resolve(hash);
                        } else {
                            const hash = await window.smartAccount.sendTransaction(params);
                            resolve(hash);
                        }
                    } catch (error) {
                        reject(error);
                    }
                });
                events.once('erc4337:sendTransactionError', (error) => {
                    reject(error);
                });
                events.emit('erc4337:prepareTransaction', feeQuotesResult);
            });

            const newSession = feeQuotesResult.sessions?.find((item) =>
                localSessions.every((local) => local.sessions[0].sessionKeyData != item.sessionKeyData)
            );
            if (!newSession) {
                throw new Error('create session error');
            }
            const sessionsData = {
                [sessionSigner.address]: {
                    signer: {
                        privateKey: sessionSigner.privateKey,
                        address: sessionSigner.address,
                    },
                    sessions: [newSession],
                },
            };

            const localKey = `sessions_${address}_${chainId}`;
            const data = localStorage.getItem(localKey);
            if (data) {
                localStorage.setItem(localKey, JSON.stringify({ ...sessionsData, ...JSON.parse(data) }));
            } else {
                localStorage.setItem(localKey, JSON.stringify(sessionsData));
            }

            return txHash;
        },
        {
            manual: true,
            onSuccess: (txHash: string) => {
                if (txHash) {
                    notification.success({
                        message: 'Send UserOp Success',
                        description: txHash,
                        onClick: () => {
                            window.open(`${chainInfo?.blockExplorerUrl}/tx/${txHash}`);
                        },
                    });
                } else {
                    notification.error({
                        message: 'UserOp Send Failure',
                        description: 'tx hash is null',
                    });
                }
                loadLocalSessions();
            },
            onError: (error: any) => {
                message.error(error.message || error);
            },
        }
    );

    const { loading: mintLoading, run: runMint } = useRequest(
        async (targetLocalSession: LocalSession, localSessions: LocalSession[]) => {
            const targetSession = targetLocalSession.sessions[0];
            const sessions = localSessions.map((item) => item.sessions[0]);
            const result = await window.smartAccount.validateSession(targetSession, sessions);
            if (!result) {
                throw new Error('validate session failed');
            }

            const wallet = new Wallet(targetLocalSession.signer.privateKey);
            const address = await window.smartAccount.getAddress();

            const mintInterface = new Interface(['function mintTo(address, uint256, uint256) public']);
            const encodedData = mintInterface.encodeFunctionData('mintTo', [address, 1, 1]);

            const tx = {
                to: erc1155TokenAddress,
                value: '0x0',
                data: encodedData,
            };

            const feeQuotesResult = await window.smartAccount.getFeeQuotes(tx);

            const txHash = await new Promise<string>((resolve, reject) => {
                events.removeAllListeners('erc4337:sendTransaction');
                events.removeAllListeners('erc4337:sendTransactionError');
                events.once('erc4337:sendTransaction', async (params: any) => {
                    try {
                        let userOpBundle: UserOpBundle;
                        if (params.feeQuote) {
                            const { feeQuote, tokenPaymasterAddress } = params as UserOpParams;
                            userOpBundle = await window.smartAccount.buildUserOperation({
                                feeQuote,
                                tokenPaymasterAddress,
                                tx,
                            });
                        } else {
                            userOpBundle = params as UserOpBundle;
                        }
                        const { userOpHash, userOp } = userOpBundle;
                        const signature = await wallet.signMessage(getBytes(userOpHash));
                        const hash = await window.smartAccount.sendSignedUserOperation(
                            { ...userOp, signature },
                            {
                                targetSession,
                                sessions,
                            }
                        );
                        resolve(hash);
                    } catch (error) {
                        reject(error);
                    }
                });
                events.once('erc4337:sendTransactionError', (error) => {
                    reject(error);
                });
                events.emit('erc4337:prepareTransaction', feeQuotesResult);
            });

            return txHash;
        },
        {
            manual: true,
            onSuccess: (txHash: string) => {
                if (txHash) {
                    notification.success({
                        message: 'Send UserOp Success',
                        description: txHash,
                        onClick: () => {
                            window.open(`${chainInfo?.blockExplorerUrl}/tx/${txHash}`);
                        },
                    });
                } else {
                    notification.error({
                        message: 'UserOp Send Failure',
                        description: 'tx hash is null',
                    });
                }
            },
            onError: (error: any) => {
                message.error(error.message || error);
            },
        }
    );

    const displayAction = useMemo(
        () => chainInfo.id === PolygonMumbai.id || chainInfo.id === ComboTestnet.id,
        [chainInfo]
    );

    const startCreateSession = () => {
        runCreateSessions(chainInfo.id, localSessions ?? []);
    };

    const loadLocalSessions = async () => {
        const address = await window.smartAccount.getAddress();
        const localKey = `sessions_${address}_${chainInfo.id}`;
        const data = localStorage.getItem(localKey);
        if (data) {
            const sessionsData: SessionData = JSON.parse(data);
            const sessions = Object.values(sessionsData);
            setLocalSessions(sessions);
        } else {
            setLocalSessions(undefined);
        }
    };

    useEffect(() => {
        if (connected && address && erc4337?.name === 'BICONOMY' && erc4337.version === '2.0.0') {
            setTimeout(() => {
                loadLocalSessions();
            }, 0);
        } else {
            setLocalSessions(undefined);
        }
    }, [connected, address, erc4337, chainInfo]);

    const deleteLocalSession = async (localSession: LocalSession) => {
        const address = await window.smartAccount.getAddress();
        const localKey = `sessions_${address}_${chainInfo.id}`;
        const data = localStorage.getItem(localKey);
        if (data) {
            const sessionsData: SessionData = JSON.parse(data);
            delete sessionsData[localSession.signer.address];
            localStorage.setItem(localKey, JSON.stringify(sessionsData));
            const sessions = Object.values(sessionsData);
            setLocalSessions(sessions);
        } else {
            setLocalSessions(undefined);
        }
    };

    const columns: ColumnsType<DataType> = [
        {
            title: 'Signer Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Action',
            dataIndex: 'localSession',
            key: 'localSession',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        loading={mintLoading}
                        onClick={() => runMint(record.localSession, localSessions!)}
                    >
                        Mint
                    </Button>
                    <Button type="primary" danger onClick={() => deleteLocalSession(record.localSession)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className="form-item">
                <h3
                    onClick={() => {
                        setFold(!fold);
                    }}
                    style={{
                        cursor: 'pointer',
                    }}
                >
                    Session Key
                    <ArrowIcon className={fold ? 'arrow-icon' : 'arrow-icon rotate'} />
                </h3>
                <div className={`fold-content ${fold ? '' : 'display'}`}>
                    <label>
                        <p style={{ fontSize: 16, marginTop: 12 }}>
                            Smart Account Session Key, you can sign userOp with session signer,{' '}
                            <a
                                href="https://docs.particle.network/developers/account-abstraction/smart-account/session-key"
                                target="_blank"
                            >
                                read more.
                            </a>
                        </p>
                    </label>

                    {displayAction && localSessions && localSessions.length > 0 && (
                        <Table
                            columns={columns}
                            dataSource={localSessions.map((item) => {
                                return {
                                    key: item.signer.address,
                                    address: isMobile() ? shortString(item.signer.address) : item.signer.address,
                                    localSession: item,
                                };
                            })}
                            title={() => {
                                return <div style={{ fontWeight: 600 }}>Local Sessions</div>;
                            }}
                        />
                    )}

                    {displayAction ? (
                        <div className="form-submit">
                            <Button
                                loading={createSessionsLoading}
                                type="primary"
                                disabled={!connected}
                                onClick={startCreateSession}
                            >
                                Create Session
                            </Button>
                        </div>
                    ) : (
                        <p
                            style={{
                                color: 'red',
                            }}
                        >
                            This demo only support {PolygonMumbai.fullname} and {ComboTestnet.fullname}, please switch
                            chain first.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AASessionKey;
