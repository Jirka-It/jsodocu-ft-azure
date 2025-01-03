import { IGeneralRequest } from './IRequest';

export interface IDocType {
    _id?: string;
    name: string;
    code: string;
    description: string;
    state: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IDocTypePartial extends Partial<IDocType> {}

export interface IDocTypeResponse extends IGeneralRequest {
    data: Array<IDocType>;
}

export interface IDocTypeResponseObject extends IDocType {
    status: number;
}
