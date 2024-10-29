export interface IModal {
    state: boolean;
    setState: Function;
}

export interface IVariableModal extends IModal {
    addData: Function;
}
