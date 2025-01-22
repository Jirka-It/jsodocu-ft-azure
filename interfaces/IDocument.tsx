import { IGeneralRequest } from './IRequest';
import { IDocType } from './IDocType';

export interface IDocument {
    _id?: string;
    name: string;
    reviewer?: string;
    creator: string;
    version?: number;
    step?: string;
    type: IDocType;
    state: string;
    template?: boolean;
    templateId?: boolean;
    scope?: string;
    title?: string;
    count?: number;
    approved?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface IDocumentPartial extends Partial<IDocument> {}

export interface IDocumentResponse extends IGeneralRequest {
    data: Array<IDocument>;
}

export interface IDocumentResponseObject extends IDocument {
    code?: number;
    status: number;
}

export interface IDocumentResponseCount {
    inEdition: number;
    inReview: number;
    code?: number;
    status: number;
}
