export interface IUser {
    _id?: string;
    username: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword?: string;
    roles: Array<any>;
}

import { IGeneralRequest } from './IRequest';

export interface IUserPartial extends Partial<IUser> {}

export interface IUserResponse extends IGeneralRequest {
    data: Array<IUser>;
}
