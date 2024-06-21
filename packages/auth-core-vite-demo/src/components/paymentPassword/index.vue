<script setup lang="ts">
import { verifyPaymentPassword } from '@particle-network/auth-core';
import { message } from 'ant-design-vue';
import { reactive } from 'vue';
import { useAuthCoreStore } from '../../store/useAuthCoreStore';
import { eventBus } from '../../utils';

const store = useAuthCoreStore();

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};

const formState = reactive({
    password: '',
});

const onFinish = async () => {
    const { password } = formState;
    try {
        if (password?.length !== 6) {
            throw new Error('Password must be 6 characters');
        } else {
            await verifyPaymentPassword(password);
            store.showPaymentPassword = false;
            eventBus.emit('receivePaymentPassword', password);
        }
    } catch (error) {
        message.error('Payment password is incorrect');
    }
};

const onCancel = () => {
    store.showPaymentPassword = false;
    eventBus.emit('receivePaymentPassword', '');
};
</script>

<template>
    <a-modal v-model:open="store.showPaymentPassword" title="Payment password" @cancel="onCancel" :footer="null">
        <div class="form-wrap">
            <a-form :model="formState" v-bind="layout" name="nest-messages" @finish="onFinish">
                <a-form-item :name="['password']" label="Password">
                    <a-input v-model:value="formState.password" type="password" />
                </a-form-item>

                <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 6 }">
                    <a-button type="primary" html-type="submit">Confirm</a-button>
                </a-form-item>
            </a-form>
        </div>
    </a-modal>
</template>

<style scoped>
.form-wrap {
    padding-top: 20px;
}
</style>
