'use client';

import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import { addLocale } from 'primereact/api';

import Providers from '@components/Providers';
import { Provider } from 'react-redux';
import { store } from '@store/store';

import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import AlertModal from '@components/Modals/AlertModal';
import AlertGuardModal from '@components/Modals/AlertGuardModal';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    addLocale('es', {
        firstDayOfWeek: 1,
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Lunio', 'Lulio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        today: 'Hoy',
        clear: 'Limpiar'
    });
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-link" href={`/theme/theme-light/blue/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <Providers>
                    <Provider store={store}>
                        <AlertModal />
                        <AlertGuardModal />
                        <PrimeReactProvider>
                            <LayoutProvider>{children}</LayoutProvider>
                        </PrimeReactProvider>
                    </Provider>
                </Providers>
            </body>
        </html>
    );
}
