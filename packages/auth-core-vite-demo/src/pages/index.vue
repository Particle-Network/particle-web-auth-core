<script setup lang="ts">
import EmailConnect from './../components/emailConnect/index.vue';
import GoogleConnect from './../components/googleConnect/index.vue';
import { useAuthCoreStore } from './../store/useAuthCoreStore';

const store = useAuthCoreStore();
const { userInfo, evmAddress, onDisconnect } = store;
 
</script>

<template>
    <div>
        <div class="login-section" v-if="!userInfo">
            <GoogleConnect />
            <EmailConnect />
        </div>
        <div class="profile-section" v-else>
            <a-button type="primary" @click="onDisconnect">Disconnect</a-button>
            <div class="address">
                <pre>Address:{{ evmAddress }}</pre>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
