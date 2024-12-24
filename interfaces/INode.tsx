export interface INodeParagraph {
    _id?: string;
    key?: string;
    ownChapter: string;
    ownArticle: string;
    label: string;
    count?: number;
    approved?: boolean;
    content: string;
    paragraph: boolean;
}

export interface INodeArticle {
    _id?: string;
    key?: string;
    label: string;
    value: string;
    content: string;
    count?: number;
    approved?: boolean;
    ownChapter: string;
    article: boolean;
    children?: Array<INodeParagraph>;
}

export interface INode {
    _id?: string;
    key?: string;
    label: string;
    value: string;
    chapter: boolean;
    document?: string;
    children?: Array<INodeArticle>;
}

export interface INodeGeneral {
    key: string;
    value?: string;
    title?: string;
    ownChapter?: string;
    ownArticle?: string;
    label: string;
    content?: string;
    count?: number;
    chapter?: boolean;
    article?: boolean;
    paragraph?: boolean;
    document?: boolean;
}
