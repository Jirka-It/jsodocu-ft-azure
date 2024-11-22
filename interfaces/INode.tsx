export interface IParagraph {
    key: number;
    OwnChapter: number;
    OwnArticle: number;
    label: string;
    content: string;
    paragraph: boolean;
}

export interface IArticle {
    key: number;
    label: string;
    value: string;
    content: string;
    OwnChapter: number;
    article: boolean;
    children?: Array<IParagraph>;
}

export interface INode {
    key: number;
    label: string;
    value: string;
    chapter: boolean;
    children?: Array<IArticle>;
}

export interface INodeGeneral {
    key: number;
    value?: string;
    OwnChapter?: number;
    OwnArticle?: number;
    label: string;
    content?: string;
    chapter?: boolean;
    article?: boolean;
    paragraph?: boolean;
}
