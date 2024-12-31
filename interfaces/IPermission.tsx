import { IGeneralRequest } from './IRequest';

export interface IPermission {
    _id?: string;
    code: string;
    name: string;
    description: string;
    category: string;
    creator?: string;
}

export interface IPermissionPartial extends Partial<IPermission> {}

export interface IPermissionResponse extends IGeneralRequest {
    data: Array<IPermission>;
}

export interface IPermissionResponseObject extends IPermission {
    status: number;
}
