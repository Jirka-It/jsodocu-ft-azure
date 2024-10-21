export interface ILogin {
    email: string;
    password: string;
}

export interface IZodError {
    code: string;
    message: string;
    path: Array<string>;
    validation: string;
}
