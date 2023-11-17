import { isMobile } from '@/utils/index';
import { AuthCoreContextProvider } from '@particle-network/auth-core-modal';
import { merge } from 'lodash';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import '../styles/erc4337GasModal.scss';
import '../styles/globals.scss';

export const isServer = () => typeof window === 'undefined';

if (!isServer()) {
    window.__PARTICLE_ENVIRONMENT__ = process.env.NEXT_PUBLIC_PARTICLE_ENV;
}

if (!isServer() && process.env.NEXT_PUBLIC_PARTICLE_ENV === 'development' && isMobile()) {
    const VConsole = require('vconsole');
    new VConsole({ theme: 'dark' });
}

export default function App({ Component, pageProps }: any) {
    const router = useRouter();

    const authCoreOptions = useMemo(() => {
        const cacheOption = isServer() ? {} : JSON.parse(localStorage.getItem('customModalOptions') || '{}');
        return merge(
            {
                projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
                clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY as string,
                appId: process.env.NEXT_PUBLIC_APP_ID as string,
                themeType: 'light',
                language: 'en',
                promptSettingConfig: {
                    promptPaymentPasswordSettingWhenSign: 2,
                    promptMasterPasswordSettingWhenLogin: 2,
                },
                customStyle: {
                    fontFamily: '"SF-Pro", "PingFang SC", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
                },
                wallet: {
                    visible: true,
                },
            },
            cacheOption
        );
    }, []);

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no,viewport-fit=cover"
                />
                <title>Auth Core Demo</title>
                <script
                    id="onpageshow"
                    data-cfasync="false"
                    dangerouslySetInnerHTML={{
                        __html: `
                            if (sessionStorage.getItem('auth-core-oauth-start') === 'true') {
                                if(!location.search.includes('particleThirdpartyParams')){
                                    window.location.reload(true)
                                }
                                sessionStorage.removeItem('auth-core-oauth-start');
                            }
                            window.onpageshow = function (e) {
                                if (e.persisted) {
                                    sessionStorage.removeItem('auth-core-oauth-start');
                                    window.location.reload(true)
                                }
                            };
      `,
                    }}
                />
            </Head>
            {router.pathname.includes('/connect') ? (
                <Component {...pageProps} />
            ) : (
                <AuthCoreContextProvider options={authCoreOptions}>
                    <Component {...pageProps} />
                </AuthCoreContextProvider>
            )}
        </>
    );
}
