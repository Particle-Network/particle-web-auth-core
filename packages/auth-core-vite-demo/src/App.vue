<script setup lang="ts">
import { chains } from '@particle-network/chains';
import EmailConnect from './components/emailConnect/index.vue';
import GoogleConnect from './components/googleConnect/index.vue';
import MasterPassword from './components/masterPassword/index.vue';
import PaymentPassword from './components/paymentPassword/index.vue';
import Sign from './components/sign/index.vue';
import SolanaSignMessage from './components/solanaSignMessage/index.vue';
import SwitchChain from './components/switchChain/index.vue';
import { useAuthCoreStore } from './store/useAuthCoreStore';
import { shortString } from './utils';
const store = useAuthCoreStore();
</script>

<template>
    <div class="content">
        <div class="login-section" v-if="!store.userInfo">
            <GoogleConnect />
            <EmailConnect />
        </div>
        <div v-else>
            <div class="evm">
                <div class="info">
                    <div class="left">
                        <div>Address:{{ shortString(store.evmAddress) }}</div>
                        <div>chainId:{{ store.chainId }}</div>
                        <div>
                            Balance:{{ store.balance }}
                            {{ chains.getEVMChainInfoById(store.chainId)?.nativeCurrency.symbol }}
                        </div>
                    </div>
                    <a-button type="primary" @click="store.onDisconnect">Disconnect</a-button>
                </div>
                <div class="options">
                    <div class="title">EVM</div>
                    <SwitchChain />
                    <Sign />
                    <!-- <AccountSecurity /> -->
                </div>

                <div class="options">
                    <div class="title">SOLANA</div>
                    <SolanaSignMessage />
                </div>
            </div>
        </div>

        <MasterPassword />
        <PaymentPassword />
    </div>
</template>

<style scoped>
.content {
    width: 800px;
    margin: auto;
}
.info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 40px;
    .left {
        display: flex;
        gap: 20px;
    }
}

.options,
.login-section {
    padding-top: 40px;
    display: flex;
    flex-direction: column;
    width: 400px;
    margin: auto;
    gap: 20px;
}
.options {
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 20px 40px;
    margin-top: 40px;
}
</style>
