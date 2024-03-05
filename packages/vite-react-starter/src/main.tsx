import { AuthCoreContextProvider } from '@particle-network/auth-core-modal';
import { Buffer } from 'buffer';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if (typeof window !== 'undefined') {
    window.Buffer = Buffer;
    window.__PARTICLE_ENVIRONMENT__ = import.meta.env.VITE_PARTICLE_ENV;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthCoreContextProvider
            options={{
                projectId: import.meta.env.VITE_PROJECT_ID as string,
                clientKey: import.meta.env.VITE_CLIENT_KEY as string,
                appId: import.meta.env.VITE_APP_ID as string,
            }}
        >
            <App />
        </AuthCoreContextProvider>
    </React.StrictMode>
);
