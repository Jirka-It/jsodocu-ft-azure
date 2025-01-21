import { INodeArticle } from './INode';

export interface IArticle extends INodeArticle {}

export interface IArticlePartial extends Partial<IArticle> {}

export interface IArticleResponse {
    data?: Array<IArticle>;
    code?: number;
    status: number;
}

export interface IArticleResponseObject extends IArticle {
    code?: number;
    status: number;
}

export interface IArticleFiles {
    files?: string[];
    _id: string;
    code?: number;
    status: number;
}
