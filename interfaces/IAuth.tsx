export interface ILogin {
    email: string;
    password: string;
}

export interface IRegister {
    name: string;
    username: string;
    password: string;
    confirmPassword?: string;
}

export interface IResponse {
    code: number;
    message: string;
}

export interface IRegisterResponse extends IResponse {}

export interface IRecoverPassword extends IResponse {}

export interface IRecover {
    email: string;
}

export interface IZodError {
    code: string;
    message: string;
    path: Array<string>;
    validation: string;
}
