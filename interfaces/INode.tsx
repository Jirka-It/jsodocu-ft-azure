export interface INodeGeneral {
    _id?: string;
    key?: string;
    value?: string;
    title?: string;
    ownChapter?: string;
    ownArticle?: string;
    label: string;
    content?: string;
    count?: number;
    chapter?: boolean;
    approved?: boolean;
    article?: boolean;
    paragraph?: boolean;
    document?: string | boolean;
}

export interface INodeParagraph extends INodeGeneral {}

export interface INodeArticle extends INodeGeneral {
    children?: Array<INodeParagraph>;
}

export interface INode extends INodeGeneral {
    children?: Array<INodeArticle>;
    document?: string;
}
