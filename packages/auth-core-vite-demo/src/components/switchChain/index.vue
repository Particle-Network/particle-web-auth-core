<script setup lang="ts">
import { particleAuth } from '@particle-network/auth-core';
import { Ethereum, EthereumSepolia } from '@particle-network/chains';
import { message } from 'ant-design-vue';
import { useAuthCoreStore } from '../../store/useAuthCoreStore';

const store = useAuthCoreStore();
const onSwitchChain = async () => {
    try {
        await particleAuth.ethereum.switchChain(
            store.chainId === EthereumSepolia.id ? Ethereum.id : EthereumSepolia.id
        );
        const chainId = await particleAuth.ethereum.request({ method: 'eth_chainId' }).then((res) => {
            return Number(res);
        });
        store.setChainId(chainId);
        message.success('Switch chain success');
    } catch (error) {
        message.error('Switch chain failed');
    }
};
</script>

<template>
    <a-button type="primary" @click="onSwitchChain">Switch chain</a-button>
</template>

<style scoped></style>
