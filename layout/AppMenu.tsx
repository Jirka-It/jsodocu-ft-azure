import { MenuModal } from '@customTypes/layout';
import AppSubMenu from './AppSubMenu';
import { Permission } from '@enums/PermissionEnum';

const AppMenu = () => {
    const model: MenuModal[] = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            permission: [Permission.HOME],
            items: [
                {
                    label: 'Inicio',
                    permission: [Permission.HOME],
                    icon: 'pi pi-home',
                    to: '/'
                }
            ]
        },
        { separator: true },
        {
            label: 'Documentos',
            permission: [Permission.DOCUMENTS],
            icon: 'pi pi-th-large',
            items: [
                {
                    label: 'En edición',
                    permission: [Permission.EDIT_VIEW_DOCUMENT],
                    icon: 'pi pi-file',
                    to: '/documents/in-edition'
                },
                {
                    label: 'En revisión',
                    permission: [Permission.IN_REVIEW_DOCUMENTS],
                    icon: 'pi pi-file',
                    to: '/documents/in-review'
                },
                {
                    label: 'Aprobados',
                    permission: [Permission.APPROVED_DOCUMENTS],
                    icon: 'pi pi-file',
                    to: '/documents/approved'
                },
                {
                    label: 'Archivados',
                    permission: [Permission.ARCHIVED_DOCUMENTS],
                    icon: 'pi pi-file',
                    to: '/documents/archived'
                }
            ]
        },
        { separator: true },
        {
            label: 'Plantillas',
            permission: [Permission.TEMPLATES],
            icon: 'pi pi-th-large',
            items: [
                {
                    label: 'Por defecto',
                    permission: [Permission.TEMPLATES],
                    icon: 'pi pi-file',
                    to: '/templates/default'
                },

                {
                    label: 'Mis plantillas',
                    permission: [Permission.TEMPLATES],
                    icon: 'pi pi-file',
                    to: '/templates/owned'
                }
            ]
        },
        { separator: true },
        {
            label: 'Seguridad',
            permission: [Permission.SECURITY],
            icon: 'pi pi-th-large',
            items: [
                {
                    label: 'Permisos',
                    permission: [Permission.PERMISSIONS],
                    icon: 'pi pi-ban',
                    to: '/configuration/permissions'
                },
                {
                    label: 'Roles',
                    permission: [Permission.ROLES],
                    icon: 'pi pi-ban',
                    to: '/configuration/roles'
                },
                {
                    label: 'Usuarios',
                    permission: [Permission.USERS],
                    icon: 'pi pi-user',
                    to: '/configuration/users'
                },

                {
                    label: 'Cuenta',
                    permission: [Permission.ACCOUNTS],
                    icon: 'pi pi-user',
                    to: '/configuration/account'
                }
            ]
        },
        { separator: true },
        {
            label: 'Configuración',
            icon: 'pi pi-th-large',
            permission: [Permission.CONFIGURATION],
            items: [
                {
                    label: 'Categorías de variables',
                    permission: [Permission.DOCUMENT_VARIABLES],
                    icon: 'pi pi-cog',
                    to: '/categories'
                },

                {
                    label: 'Tipos de documentos',
                    permission: [Permission.DOCUMENT_TYPES],
                    icon: 'pi pi-cog',
                    to: '/documents-types'
                }
            ]
        },
        { separator: true },
        {
            label: 'Sistema',
            permission: [Permission.SYSTEM],
            icon: 'pi pi-th-large',
            items: [
                {
                    label: 'Parámetros generales',
                    permission: [Permission.SIS],
                    icon: 'pi pi-chart-line'
                    //to: '/documents/in-edition'
                },
                {
                    label: 'Analítica de uso',
                    permission: [Permission.ANALYTIC],
                    icon: 'pi pi-chart-line'
                    //to: '/documents/in-edition'
                }
            ]
        }
    ];

    return <AppSubMenu model={model} />;
};

export default AppMenu;
