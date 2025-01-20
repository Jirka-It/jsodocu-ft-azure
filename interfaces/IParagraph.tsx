import { INodeParagraph } from './INode';

export interface IParagraph extends INodeParagraph {
    files?: string[];
}

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

export interface IParagraphFiles {
    files?: string[];
    _id: string;
    code?: number;
    status: number;
}
