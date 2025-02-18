import { useSession } from 'next-auth/react';
import AppSubMenu from './AppSubMenu';
import { Permission } from '@enums/PermissionEnum';
import { useEffect, useState } from 'react';
import { TokenBasicInformation } from '@lib/Token';
import { ISession } from '@interfaces/ISession';

const AppMenu = () => {
    const { data: session } = useSession(); //data:session
    const [model, setModel] = useState([]);
    useEffect(() => {
        const v: ISession = session as any;
        const decoded = TokenBasicInformation(v.access_token);
        setModelArray(decoded.accountId);
    }, [session]);

    const setModelArray = (accountId: string) => {
        setModel([
            {
                label: 'Dashboard',
                icon: 'pi pi-home',
                permission: [Permission.SUDO, Permission.HOME],
                items: [
                    {
                        label: 'Inicio',
                        permission: [Permission.SUDO, Permission.HOME],
                        icon: 'pi pi-home',
                        to: '/'
                    },

                    {
                        label: 'Mi cuenta',
                        permission: [Permission.SUDO, Permission.ACCOUNT],
                        icon: 'pi pi-user',
                        to: `/configuration/account/${accountId}`
                    }
                ]
            },
            { separator: true },
            {
                label: 'Documentos',
                permission: [Permission.SUDO, Permission.DOCUMENTS],
                icon: 'pi pi-th-large',
                items: [
                    {
                        label: 'En edición',
                        permission: [Permission.SUDO, Permission.EDIT_VIEW_DOCUMENT],
                        icon: 'pi pi-file',
                        to: '/documents/in-edition'
                    },
                    {
                        label: 'En revisión',
                        permission: [Permission.SUDO, Permission.IN_REVIEW_DOCUMENTS],
                        icon: 'pi pi-file',
                        to: '/documents/in-review'
                    },
                    {
                        label: 'Aprobados',
                        permission: [Permission.SUDO, Permission.APPROVED_DOCUMENTS],
                        icon: 'pi pi-file',
                        to: '/documents/approved'
                    },
                    {
                        label: 'Archivados',
                        permission: [Permission.SUDO, Permission.ARCHIVED_DOCUMENTS],
                        icon: 'pi pi-file',
                        to: '/documents/archived'
                    }
                ]
            },
            { separator: true },
            {
                label: 'Plantillas',
                permission: [Permission.SUDO, Permission.TEMPLATES],
                icon: 'pi pi-th-large',
                items: [
                    {
                        label: 'Por defecto',
                        permission: [Permission.SUDO, Permission.DEFAULT_TEMPLATES],
                        icon: 'pi pi-file',
                        to: '/templates/default'
                    },

                    {
                        label: 'Mis plantillas',
                        permission: [Permission.SUDO, Permission.OWN_TEMPLATES],
                        icon: 'pi pi-file',
                        to: '/templates/owned'
                    }
                ]
            },
            { separator: true },
            {
                label: 'Seguridad',
                permission: [Permission.SUDO, Permission.SECURITY],
                icon: 'pi pi-th-large',
                items: [
                    {
                        label: 'Permisos',
                        permission: [Permission.SUDO, Permission.PERMISSIONS],
                        icon: 'pi pi-ban',
                        to: '/configuration/permissions'
                    },
                    {
                        label: 'Roles',
                        permission: [Permission.SUDO, Permission.ROLES],
                        icon: 'pi pi-ban',
                        to: '/configuration/roles'
                    },
                    {
                        label: 'Usuarios',
                        permission: [Permission.SUDO, Permission.USERS],
                        icon: 'pi pi-user',
                        to: '/configuration/users'
                    },

                    {
                        label: 'Cuenta',
                        permission: [Permission.SUDO, Permission.ACCOUNTS],
                        icon: 'pi pi-user',
                        to: '/configuration/account'
                    }
                ]
            },
            { separator: true },
            {
                label: 'Configuración',
                icon: 'pi pi-th-large',
                permission: [Permission.SUDO, Permission.CONFIGURATION],
                items: [
                    {
                        label: 'Categorías de variables',
                        permission: [Permission.SUDO, Permission.DOCUMENT_VARIABLES],
                        icon: 'pi pi-cog',
                        to: '/categories'
                    },

                    {
                        label: 'Tipos de documentos',
                        permission: [Permission.SUDO, Permission.DOCUMENT_TYPES],
                        icon: 'pi pi-cog',
                        to: '/documents-types'
                    }
                ]
            }
        ]);
    };

    return <AppSubMenu model={model} />;
};

export default AppMenu;
