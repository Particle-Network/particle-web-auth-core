import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { ConfigEnv, Plugin, defineConfig } from 'vite';

const particleWasmPlugin: Plugin | undefined = {
    name: 'particle-wasm',
    apply: (_, env: ConfigEnv) => {
        return env.mode === 'development';
    },
    buildStart: () => {
        const copiedPath = path.join(
            __dirname,
            '../../node_modules/@particle-network/thresh-sig/wasm/thresh_sig_wasm_bg.wasm' //@particle-network/thresh-sig dir
        );
        const dir = path.join(__dirname, 'node_modules/.vite/wasm');
        const resultPath = path.join(dir, 'thresh_sig_wasm_bg.wasm');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.copyFileSync(copiedPath, resultPath);
    },
};

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), particleWasmPlugin],
});
