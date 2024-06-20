import type { UserInfo } from '@particle-network/auth-core';
import {
    disconnect,
    getUserInfo,
    hasMasterPassword,
    isNeedRestoreWallet,
    particleAuth,
    restoreWallet,
} from '@particle-network/auth-core';
import BigNumber from 'bignumber.js';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { eventBus, getEVMPublicAddress, thirdpartyLogin } from '../utils/index';

export const useAuthCoreStore = defineStore('authCore', () => {
    const userInfo = ref<UserInfo | undefined>();
    const evmAddress = ref<string>(userInfo.value ? getEVMPublicAddress() : '');
    const showInputMasterPassword = ref(false);
    const showPaymentPassword = ref(false);
    const chainId = ref<number>(0);
    const balance = ref<number>(0);

    const setChainId = (id: number) => {
        chainId.value = id;
    };

    const setUserInfo = (info: UserInfo | undefined) => {
        userInfo.value = info;
        evmAddress.value = info ? getEVMPublicAddress() : '';
    };

    const onDisconnect = async () => {
        await disconnect();
        setUserInfo(undefined);
    };

    const getMainPassword = async (): Promise<string> => {
        showInputMasterPassword.value = true;

        return new Promise((resolve, reject) => {
            const handleReceiveMasterPassword = async (password: string) => {
                eventBus.off('receiveMasterPassword', handleReceiveMasterPassword);
                if (!password) reject('Password is empty');
                resolve(password);
            };

            eventBus.on('receiveMasterPassword', handleReceiveMasterPassword);
        });
    };

    const getPaymentPassword = async (): Promise<string> => {
        showPaymentPassword.value = true;

        return new Promise((resolve, reject) => {
            const handleReceivePaymentPassword = async (password: string) => {
                eventBus.off('receivePaymentPassword', handleReceivePaymentPassword);
                if (!password) reject('Password is empty');
                resolve(password);
            };

            eventBus.on('receivePaymentPassword', handleReceivePaymentPassword);
        });
    };

    const init = async () => {
        particleAuth.init({
            projectId: '91bf10e7-5806-460d-95af-bef2a3122e12',
            clientKey: 'cOqbmrQ1YfOuBMo0KKDtd15bG1ENRoxuUa7nNO76',
            appId: '79df412e-7e9d-4a19-8484-a2c8f3d65a2e',
        });

        thirdpartyLogin().then((res) => {
            setUserInfo(getUserInfo());
            if (res && hasMasterPassword() && isNeedRestoreWallet()) {
                getMainPassword().then(async (password) => {
                    if (await restoreWallet(password)) {
                        setUserInfo(getUserInfo());
                    }
                });
            }
        });

        setUserInfo(getUserInfo());

        particleAuth.ethereum.request({ method: 'eth_chainId' }).then((res) => {
            chainId.value = Number(res);
        });
    };

    init();

    watch(chainId, () => {
        particleAuth.ethereum
            .request({ method: 'eth_getBalance', params: [evmAddress.value, 'latest'] })
            .then((res) => {
                balance.value = new BigNumber(res).dividedBy(1e18).toNumber();
            });
    });

    console.log('EvmAddress', evmAddress);

    return {
        userInfo,
        evmAddress,
        setUserInfo,
        onDisconnect,
        showInputMasterPassword,
        getPaymentPassword,
        getMainPassword,
        showPaymentPassword,
        chainId,
        balance,
        setChainId,
    };
});
