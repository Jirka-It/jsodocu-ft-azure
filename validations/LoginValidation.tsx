import { z } from 'zod';
import { ModelValidation } from './ModelValidation';
import { ILogin, IZodError } from '@/interfaces/IAuth';

const LoginSchema = z.object({
    email: z.string().email().min(1),
    password: z.string().min(1)
});

export const LoginValidation = (login: ILogin): Array<IZodError> | string => {
    return ModelValidation(login, LoginSchema);
};
