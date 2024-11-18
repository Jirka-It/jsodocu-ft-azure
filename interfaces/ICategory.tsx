import { IGeneralRequest } from './IRequest';

export interface ICategory {
    _id?: string;
    name: string;
    description: string;
    state: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICategoryPartial extends Partial<ICategory> {}

export interface ICategoryResponse extends IGeneralRequest {
    data: Array<ICategory>;
}
