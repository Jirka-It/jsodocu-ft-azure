import { INode } from './INode';

export interface IChapter extends INode {}

export interface IChapterPartial extends Partial<IChapter> {}

export interface IChapterResponse {
    data?: Array<IChapter>;
    code?: number;
    status: number;
}

export interface IChapterResponseObject extends IChapter {
    code?: number;
    status: number;
}
