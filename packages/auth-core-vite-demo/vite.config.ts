import particleWasmPlugin from '@particle-network/vite-plugin-wasm';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [vue(), particleWasmPlugin()],
    resolve: {
        alias: {
            buffer: 'buffer',
        },
    },
});
