export interface IModal {
    state: boolean;
    setState: Function;
}

export interface IModalDelete extends IModal {
    api: Function;
    update: Function;
    toast: any;
}

export interface IModalEditorDelete extends IModal {
    remove: Function;
}

export interface IModalCreate extends IModal {
    data: any;
    account?: string;
    update?: Function;
    toast: any;
}

export interface IVariableModal extends IModal {
    addData: Function;
    toast: any;
}
