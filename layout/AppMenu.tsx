import { MenuModal } from '@customTypes/layout';
import AppSubMenu from './AppSubMenu';

const AppMenu = () => {
    const model: MenuModal[] = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            permission: ['HOM-000'],
            items: [
                {
                    label: 'Inicio',
                    permission: ['HOM-000'],
                    icon: 'pi pi-home',
                    to: '/'
                }
            ]
        },
        { separator: true },
        {
            label: 'Documentos',
            permission: ['CAS-000'],
            icon: 'pi pi-th-large',
            items: [
                {
                    label: 'En edición',
                    permission: ['CAS-101'],
                    icon: 'pi pi-file',
                    to: '/documents/in-edition'
                },
                {
                    label: 'En revisión',
                    permission: ['CAS-102'],
                    icon: 'pi pi-file',
                    to: '/documents/in-review'
                },
                {
                    label: 'Aprobados',
                    permission: ['CAS-103'],
                    icon: 'pi pi-file',
                    to: '/documents/approved'
                },
                {
                    label: 'Archivados',
                    permission: ['CAS-104'],
                    icon: 'pi pi-file',
                    to: '/documents/archived'
                }
            ]
        },
        { separator: true },
        {
            label: 'Plantillas',
            permission: ['PLA-200'],
            icon: 'pi pi-th-large',
            items: [
                {
                    label: 'Disponibles',
                    permission: ['PLA-200'],
                    icon: 'pi pi-file'
                    //to: '/documents/in-edition'
                }
            ]
        },
        { separator: true },
        {
            label: 'Seguridad',
            permission: ['SEG-400'],
            icon: 'pi pi-th-large',
            items: [
                {
                    label: 'Permisos',
                    permission: ['SEG-401'],
                    icon: 'pi pi-ban',
                    to: '/configuration/permissions'
                },
                {
                    label: 'Roles',
                    permission: ['SEG-402'],
                    icon: 'pi pi-ban',
                    to: '/configuration/roles'
                },
                {
                    label: 'Usuarios',
                    permission: ['SEG-404'],
                    icon: 'pi pi-user',
                    to: '/configuration/users'
                },

                {
                    label: 'Cuenta',
                    permission: ['SEG-405'],
                    icon: 'pi pi-user',
                    to: '/configuration/account'
                }
            ]
        },
        { separator: true },
        {
            label: 'Configuración',
            icon: 'pi pi-th-large',
            permission: ['CONF-500'],
            items: [
                {
                    label: 'Categorías de variables',
                    permission: ['CONF-501'],
                    icon: 'pi pi-cog',
                    to: '/categories'
                },

                {
                    label: 'Tipos de documentos',
                    permission: ['CONF-502'],
                    icon: 'pi pi-cog',
                    to: '/documents-types'
                }
            ]
        },
        { separator: true },
        {
            label: 'Sistema',
            permission: ['SIS-600'],
            icon: 'pi pi-th-large',
            items: [
                {
                    label: 'Parámetros generales',
                    permission: ['SIS-601'],
                    icon: 'pi pi-chart-line'
                    //to: '/documents/in-edition'
                },
                {
                    label: 'Analítica de uso',
                    permission: ['SIS-602'],
                    icon: 'pi pi-chart-line'
                    //to: '/documents/in-edition'
                }
            ]
        }
    ];

    return <AppSubMenu model={model} />;
};

export default AppMenu;
