import { MenuModal } from '@customTypes/layout';
import AppSubMenu from './AppSubMenu';

const AppMenu = () => {
    const model: MenuModal[] = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            items: [
                {
                    label: 'Inicio',
                    icon: 'pi pi-home',
                    to: '/'
                }
            ]
        },
        { separator: true },
        {
            label: 'Documentos',
            icon: 'pi pi-th-large',
            items: [
                {
                    label: 'En edición',
                    icon: 'pi pi-file',
                    to: '/documents/in-edition'
                },
                {
                    label: 'En revisión',
                    icon: 'pi pi-file',
                    to: '/documents/in-review'
                },
                {
                    label: 'Aprobados',
                    icon: 'pi pi-file',
                    to: '/documents/approved'
                },
                {
                    label: 'Archivados',
                    icon: 'pi pi-file',
                    to: '/documents/archived'
                }
            ]
        },
        { separator: true },
        {
            label: 'Plantillas',
            icon: 'pi pi-th-large',
            items: [
                {
                    label: 'Disponibles',
                    icon: 'pi pi-file'
                    //to: '/documents/in-edition'
                }
            ]
        },
        { separator: true },
        {
            label: 'Seguridad',
            icon: 'pi pi-th-large',
            items: [
                {
                    label: 'Permisos',
                    icon: 'pi pi-ban',
                    to: '/configuration/permissions'
                },
                {
                    label: 'Roles',
                    icon: 'pi pi-ban',
                    to: '/configuration/roles'
                },
                {
                    label: 'Usuarios',
                    icon: 'pi pi-user',
                    to: '/configuration/users'
                },

                {
                    label: 'Cuenta',
                    icon: 'pi pi-user',
                    to: '/configuration/account'
                }
            ]
        },
        { separator: true },
        {
            label: 'Configuración',
            icon: 'pi pi-th-large',
            items: [
                {
                    label: 'Categorías de variables',
                    icon: 'pi pi-cog',
                    to: '/categories'
                },

                {
                    label: 'Tipos de documentos',
                    icon: 'pi pi-cog',
                    to: '/documents-types'
                }
            ]
        },
        { separator: true },
        {
            label: 'Sistema',
            icon: 'pi pi-th-large',
            items: [
                {
                    label: 'Parámetros generales',
                    icon: 'pi pi-chart-line'
                    //to: '/documents/in-edition'
                },
                {
                    label: 'Analítica de uso',
                    icon: 'pi pi-chart-line'
                    //to: '/documents/in-edition'
                }
            ]
        }
    ];

    return <AppSubMenu model={model} />;
};

export default AppMenu;
