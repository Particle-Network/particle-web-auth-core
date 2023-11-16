import { isJson, toNumber } from '@/utils/index';
import { LinkOutlined } from '@ant-design/icons';
import { isNullish } from '@particle-network/auth-core';
import type { Language } from '@particle-network/auth-core-modal';
import { useCustomize, useEthereum } from '@particle-network/auth-core-modal';
import { chains } from '@particle-network/chains';
import { Button, Input, Modal, Select, Switch, message, notification } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import aaOptions from 'src/config/erc4337';
import styles from './index.module.scss';

export type UIMode = 'dark' | 'light' | 'auto';

export type ERC4337Options = {
    name: 'SIMPLE' | 'CYBERCONNECT' | 'BICONOMY';
    version: string;
};

function DemoSetting() {
    const {
        language,
        setLanguage,
        promptSettingConfig,
        setPromptSettingConfig,
        themeType,
        setThemeType,
        customStyle,
        fiatCoin,
        setFiatCoin,
        erc4337,
        setERC4337,
        walletOptions,
        setWalletOptions,
    } = useCustomize();

    const customTextArea = useRef(null);

    const [enableERC4337Prompt, setEnableERC4337Prompt] = useState<string>();

    // options
    const LanguageOptions = ['en', 'zh-cn', 'zh-tw', 'ja', 'ko'];

    const ThemeOptions = ['light', 'dark'];

    const FiatCoinOptions = ['USD', 'CNY', 'JPY', 'HKD', 'INR', 'KRW'];

    const ERC4337Types = ['DISABLE', 'BICONOMY', 'CYBERCONNECT', 'SIMPLE'];

    const router = useRouter();

    const SettingWhenLoginOption = [
        { value: '0', label: 'None' },
        { value: '1', label: 'Once' },
        { value: '2', label: 'Always' },
        { value: '3', label: 'Force' },
    ];

    const { chainInfo, switchChain: evmSwitchChain } = useEthereum();

    const onERC4337Change = (typeName: string) => {
        if (typeName === ERC4337Types[0]) {
            setERC4337(undefined);
        } else {
            const currentChain = chainInfo;
            //'SIMPLE' | 'CYBERCONNECT' | 'BICONOMY'
            let aaSupportChains;
            if (typeName === 'BICONOMY') {
                aaSupportChains = aaOptions.biconomy?.map((item) => item.chainId);
            } else if (typeName === 'CYBERCONNECT') {
                aaSupportChains = aaOptions.cyberConnect?.map((item) => item.chainId);
            } else {
                aaSupportChains = aaOptions.simple?.map((item) => item.chainId);
            }
            if (aaSupportChains.includes(currentChain.id)) {
                setERC4337({
                    name: typeName,
                    version: '1.0.0',
                });
            } else {
                setEnableERC4337Prompt(typeName);
            }
        }
    };

    const switchChainAndEnableErc4337 = async (typeName: string) => {
        let firstChainId;
        if (typeName === 'BICONOMY') {
            firstChainId = aaOptions.biconomy[0].chainId;
        } else if (typeName === 'CYBERCONNECT') {
            firstChainId = aaOptions.cyberConnect[0].chainId;
        } else {
            firstChainId = aaOptions.simple[0].chainId;
        }
        const chain = chains.getEVMChainInfoById(firstChainId);
        if (chain) {
            await evmSwitchChain(firstChainId);
            setERC4337({
                name: typeName,
                version: '1.0.0',
            });
            setEnableERC4337Prompt(undefined);
        }
    };

    useEffect(() => {
        localStorage.setItem(
            'customModalOptions',
            JSON.stringify({
                language,
                themeType,
                customStyle,
                promptSettingConfig,
                erc4337,
                fiatCoin,
                wallet: walletOptions,
            })
        );
    }, [language, themeType, customStyle, promptSettingConfig, erc4337, fiatCoin, walletOptions]);

    const setWalletCustomStyle = () => {
        if (customTextArea.current) {
            const text = (customTextArea.current as any).resizableTextArea.textArea.value;
            try {
                if (text && !isJson(text)) {
                    return notification.error({
                        message: 'Failed to verify json',
                    });
                }
                if (text && text.trim()) {
                    const style = JSON.parse(text);
                    setWalletOptions({ ...walletOptions, customStyle: style });
                } else {
                    setWalletOptions({ ...walletOptions, customStyle: undefined });
                }
            } catch (e) {
                message.error('JSON Parse error');
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className="filter-box card" style={{ flex: 1 }}>
                <h2
                    className="filter-title"
                    onClick={() => router.push('/customize.html')}
                    style={{ cursor: 'pointer' }}
                >
                    Modal Customize
                    <LinkOutlined style={{ marginLeft: 8 }} />
                </h2>
                <div className="filter-item">
                    <div className="filter-label">Language</div>
                    <Select
                        value={language as Language}
                        onChange={setLanguage}
                        style={{ width: 100 }}
                        options={LanguageOptions.map((item: string) => ({
                            label: item,
                            value: item,
                        }))}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </div>
                <div className="filter-item">
                    <div className="filter-label">Auth Theme</div>
                    <Select
                        value={themeType}
                        onChange={setThemeType}
                        style={{ width: 100 }}
                        options={ThemeOptions.map((item: string) => ({
                            label: item.charAt(0).toUpperCase() + item.slice(1),
                            value: item,
                        }))}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </div>
                <div className="filter-item">
                    <div className="filter-label">Fiat Coin</div>
                    <Select
                        value={fiatCoin}
                        onChange={setFiatCoin}
                        style={{ width: 100 }}
                        options={FiatCoinOptions.map((item) => ({
                            label: item,
                            value: item,
                        }))}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </div>
                <div className="filter-item">
                    <div className="filter-label">ERC-4337 (EVM)</div>
                    <Select
                        value={!erc4337 ? ERC4337Types[0] : erc4337.name}
                        onChange={onERC4337Change}
                        style={{ width: 100 }}
                        options={ERC4337Types.map((item) => ({
                            label: item,
                            value: item,
                        }))}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </div>
                <div className="filter-item">
                    <div className="filter-label">Prompt Master Password</div>
                    <Select
                        value={toNumber(promptSettingConfig?.promptMasterPasswordSettingWhenLogin ?? 0).toString()}
                        onChange={(value) => {
                            setPromptSettingConfig({
                                promptMasterPasswordSettingWhenLogin: Number(value),
                                promptPaymentPasswordSettingWhenSign:
                                    promptSettingConfig?.promptPaymentPasswordSettingWhenSign,
                            });
                        }}
                        style={{ width: 100 }}
                        options={SettingWhenLoginOption}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </div>
                <div className="filter-item">
                    <div className="filter-label">Prompt Payment Password</div>
                    <Select
                        value={toNumber(promptSettingConfig?.promptPaymentPasswordSettingWhenSign ?? 1).toString()}
                        onChange={(value) => {
                            setPromptSettingConfig({
                                promptMasterPasswordSettingWhenLogin:
                                    promptSettingConfig?.promptMasterPasswordSettingWhenLogin,
                                promptPaymentPasswordSettingWhenSign: Number(value),
                            });
                        }}
                        style={{ width: 100 }}
                        options={SettingWhenLoginOption}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </div>

                <Modal
                    title="Enable ERC-4337 Prompt"
                    open={!isNullish(enableERC4337Prompt)}
                    centered
                    onCancel={() => setEnableERC4337Prompt(undefined)}
                    onOk={() => switchChainAndEnableErc4337(enableERC4337Prompt!)}
                >
                    {`${enableERC4337Prompt} not support current chain, click OK to automatically switch chain and enable
                ERC-4337.`}
                </Modal>
            </div>

            <div className="filter-box card" style={{ flex: 1, marginBottom: 160 }}>
                <h2
                    className="filter-title"
                    onClick={() => window.open('https://docs.particle.network/developers/wallet-service/sdks/web')}
                    style={{ cursor: 'pointer' }}
                >
                    Wallet Customize
                    <LinkOutlined style={{ marginLeft: 8 }} />
                </h2>
                <div className="filter-item">
                    <div className="filter-label">Wallet Entrance</div>
                    <Switch
                        defaultChecked={walletOptions?.visible ?? false}
                        checked={walletOptions?.visible ?? false}
                        onChange={(value) => {
                            const wallet = walletOptions || {};
                            wallet.visible = value;
                            setWalletOptions(wallet);
                            // if (value) {
                            //     window.particleAuth?.walletEntryCreate();
                            // } else {
                            //     window.particleAuth?.walletEntryDestroy();
                            // }
                        }}
                    />
                </div>

                <div className="filter-item">
                    <div className="filter-label">Wallet Theme</div>
                    <Select
                        value={walletOptions?.themeType ?? 'light'}
                        onChange={(theme) => {
                            const wallet = walletOptions || {};
                            wallet.themeType = theme;
                            setWalletOptions(wallet);
                        }}
                        style={{ width: 100 }}
                        options={ThemeOptions.map((item: string) => ({
                            label: item,
                            value: item,
                        }))}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </div>

                <div className="filter-item column">
                    <div className="filter-label">Custom Style</div>
                    <Button
                        size="small"
                        type="primary"
                        style={{ position: 'absolute', right: 0 }}
                        onClick={setWalletCustomStyle}
                    >
                        Save
                    </Button>
                    <Input.TextArea
                        ref={customTextArea}
                        autoSize={true}
                        className="filter-input"
                        placeholder="custom wallet style, json format"
                        defaultValue={JSON.stringify(walletOptions?.customStyle) || ''}
                    />
                </div>
            </div>
        </div>
    );
}

export default DemoSetting;
