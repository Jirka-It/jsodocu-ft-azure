import { IUser } from './IUser';

export interface ISession {
    access_token: string;
}

export interface IToken {
    roles?: string[];
    permissions: string[];
    sub: any;
    accountId: any;
    user: IUser;
}
