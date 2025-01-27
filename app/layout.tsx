'use client';

import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';

import Providers from '@components/Providers';
import { Provider } from 'react-redux';
import { store } from '@store/store';

import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import AlertModal from '@components/Modals/AlertModal';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-link" href={`/theme/theme-light/blue/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <Providers>
                    <Provider store={store}>
                        <AlertModal />

                        <PrimeReactProvider>
                            <LayoutProvider>{children}</LayoutProvider>
                        </PrimeReactProvider>
                    </Provider>
                </Providers>
            </body>
        </html>
    );
}
