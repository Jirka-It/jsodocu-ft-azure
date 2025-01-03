export interface IBasicAction {
    handleEdit: Function;
    handleDelete: Function;
}

export interface IDocumentAction extends IBasicAction {
    handleView: Function;
    children: any;
}

export interface ICustomAction extends IBasicAction {
    data: string;
    children?: any;
}

export interface ICustomUserAction extends ICustomAction {
    handleEditPassword: Function;
}
