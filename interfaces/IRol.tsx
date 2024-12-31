import { IGeneralRequest } from './IRequest';

export interface IRol {
    _id?: string;
    code: string;
    name: string;
    applyToAccount: boolean;
    state: string;
    description: string;
    permissions: Array<string>;
    creator?: string;
}

export interface IRolPartial extends Partial<IRol> {}

export interface IRolResponse extends IGeneralRequest {
    data: Array<IRol>;
}

export interface IRolResponseObject {
    code?: string;
    status: number;
    data: IRol;
}
