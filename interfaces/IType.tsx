import { IGeneralRequest } from './IRequest';

export interface IType {
    name: string;
    code: string;
    description: string;
    state?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ITypeResponse extends IGeneralRequest {
    data: Array<IType>;
}
