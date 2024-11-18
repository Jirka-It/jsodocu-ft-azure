export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    roles: Array<any>;
}
