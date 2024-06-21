<script setup lang="ts">
import { SignTypedDataVersion, hasPaymentPassword, particleAuth } from '@particle-network/auth-core';
import { message } from 'ant-design-vue';
import { useAuthCoreStore } from '../../store/useAuthCoreStore';
import { toHexPrefixString } from '../../utils';
import { signTypedData } from './data';

const store = useAuthCoreStore();

const onSignTypedData = async () => {
    const signTypedDataParams = {
        data: signTypedData as any,
        version: SignTypedDataVersion.V4,
        uniq: false,
    };

    if (await hasPaymentPassword()) {
        await store.getPaymentPassword();
    }

    const res = await particleAuth.ethereum.signTypedData(signTypedDataParams);

    message.info('Sign Typed Data Result: ' + res);
};

const sendNativeToken = async () => {
    try {
        const data = {
            from: store.evmAddress,
            gasPrice: '0x853e3fbb',
            gasLimit: '0x5208',
            to: '0x6Bc8fd522354e4244531ce3D2B99f5dF2aAE335e',
            value: '0x0',
            type: '0x0',
        } as any;
        if (await hasPaymentPassword()) {
            await store.getPaymentPassword();
        }
        const res = await particleAuth.ethereum.sendTransaction(data);
        message.info('Send Native Token Result: ' + res);
    } catch (error: any) {
        message.error('sendNativeToken Error: ' + error.message);
        console.log('sendNativeToken Error: ', error);
    }
};
const onPersonalSign = async () => {
    try {
        if (await hasPaymentPassword()) {
            await store.getPaymentPassword();
        }
        const result = await particleAuth.ethereum.signMessage(toHexPrefixString('111'), true);
        message.info('Personal Sign Result: ' + result);
    } catch (error: any) {
        message.error('onPersonalSign Error: ' + error.message);
        console.log('onPersonalSign Error: ', error);
    }
};
</script>

<template>
    <div class="list">
        <a-button type="primary" @click="sendNativeToken">Send Native Token</a-button>
        <a-button type="primary" @click="onPersonalSign">Personal Sign</a-button>
        <a-button type="primary" @click="onSignTypedData">Sign Typed Data</a-button>
    </div>
</template>

<style scoped>
.list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
</style>
