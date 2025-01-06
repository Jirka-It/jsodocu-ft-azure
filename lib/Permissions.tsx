const CryptoJS = require('crypto-js');
import { env } from '@config/env';
import { TokenBasicInformation } from './Token';

const containsAny = (arr1, arr2) => {
    return arr1.some((item) => arr2.includes(item));
};

export const VerifyPermissions = (token: string, permissionsPermitted: Array<string>): boolean => {
    try {
        const tokenDecoded = TokenBasicInformation(token);

        const permissionDecoded = tokenDecoded.permissions.map((p) => {
            const bytes = CryptoJS.AES.decrypt(p, env.NEXT_PUBLIC_ENCRYPT_SECRET);
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            return decryptedData;
        });

        return containsAny(permissionDecoded, permissionsPermitted); //Verify if user's permissions contains some permissions permitted
    } catch (error) {
        return false;
    }
};
