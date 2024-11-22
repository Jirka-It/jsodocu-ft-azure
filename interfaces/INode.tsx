export interface IParagraph {
    key: string;
    OwnChapter: string;
    OwnArticle: string;
    label: string;
    content: string;
    paragraph: boolean;
}

export interface IArticle {
    key: string;
    label: string;
    value: string;
    content: string;
    OwnChapter: string;
    article: boolean;
    children?: Array<IParagraph>;
}

export interface INode {
    key: string;
    label: string;
    value: string;
    chapter: boolean;
    children?: Array<IArticle>;
}

export interface INodeGeneral {
    key: string;
    value?: string;
    OwnChapter?: string;
    OwnArticle?: string;
    label: string;
    content?: string;
    chapter?: boolean;
    article?: boolean;
    paragraph?: boolean;
}
