import { Buffer } from 'buffer';
(window as any).Buffer = Buffer;

import Antd from 'ant-design-vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

app.use(Antd);

app.mount('#app');
