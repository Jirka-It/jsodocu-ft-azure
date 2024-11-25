export interface INodeParagraph {
    _id?: string;
    key?: string;
    ownChapter: string;
    ownArticle: string;
    label: string;
    content: string;
    paragraph: boolean;
}

export interface INodeArticle {
    _id?: string;
    key?: string;
    label: string;
    value: string;
    content: string;
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
    ownChapter?: string;
    ownArticle?: string;
    label: string;
    content?: string;
    chapter?: boolean;
    article?: boolean;
    paragraph?: boolean;
}
