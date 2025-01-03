import { INodeParagraph } from './INode';

export interface IParagraph extends INodeParagraph {}

export interface IParagraphPartial extends Partial<IParagraph> {}

export interface IParagraphResponse {
    data?: Array<IParagraph>;
    code?: number;
    status: number;
}

export interface IParagraphResponseObject extends IParagraph {
    code?: number;
    status: number;
}
