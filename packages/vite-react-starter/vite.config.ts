import particleWasmPlugin from '@particle-network/vite-plugin-wasm';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), particleWasmPlugin()],
});
