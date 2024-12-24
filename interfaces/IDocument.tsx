import { IGeneralRequest } from './IRequest';
import { IDocType } from './IDocType';

export interface IDocument {
    _id?: string;
    name: string;
    reviewer?: string;
    creator: string;
    version: number;
    step: string;
    type: IDocType;
    state: string;
    template?: string;
    title?: string;
    count?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface IDocumentPartial extends Partial<IDocument> {}

export interface IDocumentResponse extends IGeneralRequest {
    data: Array<IDocument>;
}
