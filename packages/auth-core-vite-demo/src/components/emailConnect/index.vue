<script setup lang="ts">
import {
connect,
getConnectCaptcha,
getUserInfo,
hasMasterPassword,
isNeedRestoreWallet,
restoreWallet,
} from '@particle-network/auth-core';
import { message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { useAuthCoreStore } from '../../store/useAuthCoreStore';

const store = useAuthCoreStore();
const open = ref<boolean>(false);
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};
const showModal = () => {
    open.value = true;
};
const formState = reactive({
    user: {
        email: '357934522@qq.com',
        code: '',
    },
});

const onSendCode = async () => {
    try {
        if (!formState.user.email) {
            throw new Error('Please enter your email address!');
        } else if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(formState.user.email) === false) {
            throw new Error('Please enter the correct email address!');
        }
        const res = await getConnectCaptcha({
            email: formState.user.email,
        });

        if (res) {
            message.success('Verification code sent successfully!');
        } else {
            throw new Error('Failed to send verification code!');
        }
    } catch (error: any) {
        message.error(error?.message);
    }
};

const onConnect = async () => {
    try {
        if (!formState.user.email || !formState.user.code) {
            throw new Error('Please complete the information!');
        }

        const userInfo = await connect({
            email: formState.user.email,
            code: formState.user.code,
        });

        open.value = false;

        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        message.success('Connect successfully!');

        if (hasMasterPassword() && isNeedRestoreWallet()) {
            store.getMainPassword().then(async (password) => {
                if (await restoreWallet(password)) {
                    store.setUserInfo(getUserInfo());
                }
            });
        }
    } catch (error: any) {
        message.error(error?.extra?.[0] || error?.message);
    }
};
</script>

<template>
    <a-button type="primary" class="btn" @click="showModal">
        <div class="icon">
            <a-image
                :width="18"
                :preview="false"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAAB4CAYAAAB1ovlvAAAAAXNSR0IArs4c6QAABQxJREFUeF7t3Vty2zgQQFFjY7G9r1TZWZa/rGwqv4hBi5JFUcSjCRDovvyZmgkBDq9OgY8ksntK3Lz3L+dd387/nP89cQZ2U17g9PT09Deco3PuPfVcXeqO3vsw6YwvdRj72Sxwcs69ppx6MsAwGQhTkprfJxnftFrm5gJhbjFT+2fhKwLISmgKVM7JZuMrBgjCnM/FxL5F+EQAQWgCVspJFuO7ARheszjnwqN01sY9YVYubTuL8C0B+q+Hkj8573DmmiDU5irpfIrxee8/z9ZO01PwAhAIk/qb3kmKL/wmxjTHDDCsfj83EJr2tXnye+CbDuDCtnH5BCEIlwV2w3ee+NcWwLAPCEE4F9gbX5j3IwAMN4Rbf7AAhCCsgS8ZICuhbYC18F0ALh9AHuVmJbQHsSa+UPNfuASnAmQltAWwNr4igCC0gbAFvmKAINSNsBU+EUAQ6kTYEp8YIAh1IWyNbxeAINSB8Ah8uwEE4dgIj8K3K0AQjonwSHy7AwThWAiPxlcFIAjHQNgDvmoAQdg3wl7wVQUIwj4R9oSvOkAQ9oWwN3xNAIKwD4Q94msGEITHIuwVX1OAIDwGYc/4mgMEYVuEveM7BCAI2yAcAd9hAEFYF+Eo+A4FCMI6CEfCdzhAEO6LcDR8XQAE4T4IR8TXDUAQyhCOiq8rgCAsQzgyvu4AgjAP4ej4ugQIwjSEGvB1CxCE2wi14OsaIAjXEWrC1z1AEN4i1IZvCIAg/EaoEd8wAK0j1IpvKIBWEWrGNxxAawi14xsSoBWEFvANC1A7Qiv4hgaoFaElfMMD1IbQGj4VALUgtIhPDcDREVrFpwrgqAgt41MHcDSE1vGpBDgKQvB9/x539k9K+h7W/9bzjxUD39WPWoC9roTgu128VAPsDSH47q+c6gH2ghB867dtJgAejRB8j58ZzAA8CiH4th9YTQFsjRB88bcl5gC2Qgi+OD7V7wFjp1/zPSH4YvWNvAeMZaiBEHyx6sbeA8Zy7IkQfLHaRt8DxrLsgRB8scrG3wPG8kgQPjvnXmMHWPt17/3n1186fykZq2SMyafgR59dEcJSCOCbygFwAagJQvBdqgNwZQWrihB8N8UB+OASWgUh+O5qA3DjHm5XhOBbLQ3AyEPELgjB97AyABOeYkUIwbdZGIAJAMMuRQjBF60LwGii6w5ZCMGXVBaASZkyEYIvuSoAk1MlIgRfVlEAZuWKIARfdk0AZid7gBB8RSUBWJRtgRB8xRUBWJzuOvBk/I9USRICUFKPseICABQnZAJJAQBK6jFWXACA4oRMICkAQEk9xooLAFCckAkkBQAoqcdYcQEAihMygaQAACX1GCsuAEBxQiaQFACgpB5jxQUAKE7IBJICAJTUY6y4AADFCZlAUgCAknqMFRcAoDghE0gKAFBSj7HiAgAUJ2QCSQEASuoxVlxgAmj9a2LFFZmguAAAi9MxcI8CH6yAe2RkjtICvwPA8C3t4TLMRoHWBX67cETvvW99ZI5HARe2M0AeRPDQusD0dXczQC7DrfNzvCtAVkE0NC5w+bLPaQWcN+4FG38MRg833/qF018C5FJsFEXD0351zoUvdJq2G4DnS/H714PxW8P/IQ5lp8Dd92zfATwjZCW0g6LVmd6sfA9XwMU9Iathq49H73E2f5by6gq4gjD8Jy7LepHUOLNwnxcuuZf7vbWDRAE+wPjMt4LW+MyGnfMnsii6n2f5H0QkEMieTWlrAAAAAElFTkSuQmCC"
            />
        </div>
        Email
    </a-button>

    <a-modal v-model:open="open" title="Email Connect" @cancel="open = false" :footer="null">
        <a-form :model="formState" v-bind="layout" name="nest-messages" @finish="onConnect">
            <a-form-item :name="['user', 'name']" label="Email">
                <a-input v-model:value="formState.user.email" />
            </a-form-item>

            <a-form-item :name="['user', 'age']" label="Code">
                <a-row>
                    <a-col :span="16">
                        <a-input v-model:value="formState.user.code" />
                    </a-col>
                    <a-col :span="8">
                        <a-button type="link" @click="onSendCode">Send code</a-button>
                    </a-col>
                </a-row>
            </a-form-item>

            <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 6 }">
                <a-button type="primary" html-type="submit">Connect</a-button>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<style scoped></style>

<style scoped>
.btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    .icon {
        position: relative;
        top: -1px;
    }
}
</style>
