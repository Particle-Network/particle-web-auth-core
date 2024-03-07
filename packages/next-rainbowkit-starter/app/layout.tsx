import { Providers } from '@/rainbowKit';
import { AuthCoreContextProvider } from '@particle-network/auth-core-modal';
import '@rainbow-me/rainbowkit/styles.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthCoreContextProvider
                    options={{
                        projectId: '34c6b829-5b89-44e8-90a9-6d982787b9c9',
                        clientKey: 'c6Z44Ml4TQeNhctvwYgdSv6DBzfjf6t6CB0JDscR',
                        appId: 'ded98dfe-71f9-4af7-846d-5d8c714d63b0',
                        customStyle: {
                            zIndex: 2147483650, // must greater than 2147483646
                        },
                    }}
                >
                    <Providers>{children}</Providers>
                </AuthCoreContextProvider>
            </body>
        </html>
    );
}
