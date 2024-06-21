<script setup lang="ts">
import { thirdpartyAuth } from '@particle-network/auth-core';

const onGoogleConnect = async () => {
    await thirdpartyAuth({
        authType: 'google',
    });
};
</script>

<template>
    <a-button type="primary" @click="onGoogleConnect" class="btn">
        <a-image :width="30" src="https://core-demo.particle.network/_next/static/media/google_icon.85d10e5c.png" />
        Google
    </a-button>
</template>

<style scoped>
.btn {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
