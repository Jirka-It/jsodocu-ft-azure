import { Permission } from '@enums/PermissionEnum';

import { VerifyPermissions } from './Permissions';

export const GuardRoute = (token: string, route: string): boolean => {
    try {
        //Route Verification
        if (route === '/') {
            return VerifyPermissions(token, [Permission.SUDO, Permission.HOME]);
        } else if (route.startsWith('/documents/in-edition')) {
            return VerifyPermissions(token, [Permission.SUDO, Permission.EDIT_VIEW_DOCUMENT]);
        } else if (route.startsWith('/documents/in-review')) {
            return VerifyPermissions(token, [Permission.SUDO, Permission.IN_REVIEW_DOCUMENTS]);
        } else if (route.startsWith('/documents/approved')) {
            return VerifyPermissions(token, [Permission.SUDO, Permission.APPROVED_DOCUMENTS]);
        } else if (route.startsWith('/documents/archived')) {
            return VerifyPermissions(token, [Permission.SUDO, Permission.ARCHIVED_DOCUMENTS]);
        } else if (route.startsWith('/templates/default')) {
            return VerifyPermissions(token, [Permission.SUDO, Permission.DEFAULT_TEMPLATES]);
        } else if (route.startsWith('/templates/owned')) {
            return VerifyPermissions(token, [Permission.SUDO, Permission.OWN_TEMPLATES]);
        } else if (route.startsWith('/configuration/permissions')) {
            return VerifyPermissions(token, [Permission.SUDO, Permission.PERMISSIONS]);
        } else if (route.startsWith('/configuration/roles')) {
            return VerifyPermissions(token, [Permission.SUDO, Permission.ROLES]);
        } else if (route.startsWith('/configuration/users')) {
            return VerifyPermissions(token, [Permission.SUDO, Permission.USERS]);
        } else if (route.startsWith('/configuration/account')) {
            return VerifyPermissions(token, [Permission.SUDO, Permission.ACCOUNTS]);
        } else if (route.startsWith('/categories')) {
            return VerifyPermissions(token, [Permission.SUDO, Permission.DOCUMENT_VARIABLES]);
        } else if (route.startsWith('/documents-types')) {
            return VerifyPermissions(token, [Permission.SUDO, Permission.DOCUMENT_TYPES]);
        }

        return false;
    } catch (error) {
        return false;
    }
};
