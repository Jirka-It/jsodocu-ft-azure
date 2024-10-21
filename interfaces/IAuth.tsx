export interface ILogin {
    email: string;
    password: string;
}

export interface IRegister {
    username: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface IRegisterResponse {
    code: number;
    message: string;
}

export interface IZodError {
    code: string;
    message: string;
    path: Array<string>;
    validation: string;
}
