export interface IAccount {
    _id?: string;
    name: string;
    nit: string;
    description: string;
    website: string;
    city: string;
    email: string;
    alternateEmail: string;
    photo: string;
    adminId: string;
    state: string;
}

import { IGeneralRequest } from './IRequest';

export interface IAccountPartial extends Partial<IAccount> {}

export interface IAccountResponse extends IGeneralRequest {
    data: Array<IAccount>;
}

export interface IAccountResponseObject extends IAccount {
    code?: number;
    status: number;
}
