import { IUser } from './IUser';

export interface ISession {
    access_token: string;
    user: IUser;
}
