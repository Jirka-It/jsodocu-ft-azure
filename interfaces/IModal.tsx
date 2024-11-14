export interface IModal {
    state: boolean;
    setState: Function;
}

export interface IModalDelete extends IModal {
    api: Function;
    update: Function;
}

export interface IVariableModal extends IModal {
    addData: Function;
}
