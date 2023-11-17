import { AuthCoreContextProvider } from '@particle-network/auth-core-modal';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AuthCoreContextProvider
            options={{
                projectId: 'Your Particle Project ID',
                clientKey: 'Your Particle Project Client Key',
                appId: 'Your Particle Project App ID',
            }}
        >
            <Component {...pageProps} />
        </AuthCoreContextProvider>
    );
}

export default MyApp;
