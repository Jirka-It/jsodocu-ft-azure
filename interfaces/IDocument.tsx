import { IGeneralRequest } from './IRequest';

export interface IDocument {
    name: string;
    reviewer?: string;
    creator?: string;
    type: string;
    state?: string;
    template: string;
}

export interface IDocumentResponse extends IGeneralRequest {
    data: Array<IDocument>;
}
