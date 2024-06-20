<script setup lang="ts">
import { hasPaymentPassword, particleAuth } from '@particle-network/auth-core';
import { message } from 'ant-design-vue';
import { useAuthCoreStore } from '../../store/useAuthCoreStore';
const store = useAuthCoreStore();
const signMessage = async () => {
    if (await hasPaymentPassword()) {
        await store.getPaymentPassword();
    }
    const result = await particleAuth.solana.signMessage(Buffer.from('hello world'));
    message.success(Buffer.from(result).toString('base64'));
};
</script>

<template>
    <a-button type="primary" @click="signMessage">Sign Message</a-button>
</template>

<style scoped></style>
