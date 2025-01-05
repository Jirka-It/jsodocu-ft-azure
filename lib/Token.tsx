import { IToken } from '@interfaces/ISession';
import { jwtDecode } from 'jwt-decode';

export const TokenBasicInformation = (data: string): IToken => {
    return jwtDecode(data);
};
