import { ICategory } from './ICategory';
import { IDocument } from './IDocument';
import { IGeneralRequest } from './IRequest';

export interface IVariableCreate {
    _id?: string;
    name: string;
    category: string;
}

export interface IVariable {
    _id?: string;
    name: string;
    value: string;
    category: string;
    document: string;
    type: string;
    state: string;
}

export interface IVariableSelect {
    _id?: string;
    name: string;
    value: string;
    category: ICategory;
    document: IDocument;
    type: string;
    state: string;
}

export interface IVariablePartial extends Partial<IVariable> {}

export interface IVariableResponse extends IGeneralRequest {
    data: Array<IVariable>;
}
