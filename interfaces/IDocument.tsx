import { IGeneralRequest } from './IRequest';
import { IType } from './IType';

export interface IDocument {
    name?: string;
    reviewer?: string;
    creator?: string;
    type?: IType;
    state?: string;
    template?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IDocumentResponse extends IGeneralRequest {
    data: Array<IDocument>;
}
