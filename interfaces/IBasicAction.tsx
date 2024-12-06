export interface IBasicAction {
    handleEdit: Function;
    handleDelete: Function;
}

export interface IDocumentAction extends IBasicAction {
    handleView: Function;
}

export interface ICustomAction extends IBasicAction {
    data: string;
}
