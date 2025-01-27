export interface IUser {
    _id?: string;
    username: string;
    name: string;
    photo: string;
    lastName: string;
    password?: string;
    confirmPassword?: string;
    accountName?: string;
    accountPhoto?: string;
    accountId?: string;
    state: string;
    roles: Array<any>;
    creator?: string;
}

interface IMonth {
    month: string;
    avgPercentageUse: number;
}

export interface IUserDashboard {
    id: string;
    name: string;
    lastName: string;
    username: string;
    account: string;
    photo: string;
    roles: string;
    inEdition: number;
    inReview: number;
    approved: number;
    averageUsePercentage: number;
    useLastSixMonths: Array<IMonth>;
    code?: number;
    status: number;
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
