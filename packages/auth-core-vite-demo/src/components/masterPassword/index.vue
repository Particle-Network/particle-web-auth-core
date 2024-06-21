<script setup lang="ts">
import { verifyMasterPassword } from '@particle-network/auth-core';
import { message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { useAuthCoreStore } from '../../store/useAuthCoreStore';
import { eventBus } from '../../utils';

const loading = ref(false);

const store = useAuthCoreStore();

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

const formState = reactive({
    password: '',
});

const onFinish = async () => {
    loading.value = true;
    const { password } = formState;
    try {
        if (!(password?.length >= 6 && password?.length <= 20)) {
            message.error('Password must be between 6 and 20 characters');
        } else if (!(await verifyMasterPassword(password))) {
            message.error('Master password is incorrect');
        } else {
            store.showInputMasterPassword = false;
            eventBus.emit('receiveMasterPassword', password);
        }
    } catch (error) {
        message.error('Master password is incorrect');
    }
    loading.value = false;
};

const onCancel = () => {
    store.showInputMasterPassword = false;
    eventBus.emit('receiveMasterPassword', '');
};
</script>

<template>
    <a-modal
        v-model:open="store.showInputMasterPassword"
        title="Restore Master Password"
        @cancel="onCancel"
        :footer="null"
    >
        <div class="form-wrap">
            <a-form :model="formState" v-bind="layout" name="nest-messages" @finish="onFinish">
                <a-form-item :name="['password']" label="Password">
                    <a-input v-model:value="formState.password" type="password" />
                </a-form-item>

                <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 6 }">
                    <a-button type="primary" html-type="submit" :loading="loading">Confirm</a-button>
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
