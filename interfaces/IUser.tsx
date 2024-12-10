export interface IUser {
    _id?: string;
    username: string;
    name: string;
    lastName: string;
    password?: string;
    confirmPassword?: string;
    accountId?: string;
    state: string;
    roles: Array<any>;
    creator?: string;
}

import { IGeneralRequest } from './IRequest';

export interface IUserPartial extends Partial<IUser> {}

export interface IUserResponse extends IGeneralRequest {
    data: Array<IUser>;
}
