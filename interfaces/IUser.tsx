export interface IUser {
    _id?: string;
    username: string;
    name: string;
    lastName: string;
    password?: string;
    confirmPassword?: string;
    accountPhoto?: string;
    accountId?: string;
    state: string;
    roles: Array<any>;
    creator?: string;
}

export interface IUserPassword {
    password: string;
    confirmPassword?: string;
}

import { IGeneralRequest } from './IRequest';

export interface IUserPartial extends Partial<IUser> {}

export interface IUserResponse extends IGeneralRequest {
    data: Array<IUser>;
}

export interface IUserResponseObject extends IUser {
    code?: number;
    status: number;
}
