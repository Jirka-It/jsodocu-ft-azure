import { z } from 'zod';
import { ModelValidation } from './ModelValidation';
import { IRegister, IZodError } from '@interfaces/IAuth';

const RegisterSchema = z
    .object({
        username: z.string().min(1),
        email: z.string().email().min(1),
        password: z.string().min(1),
        confirmPassword: z.string().min(1)
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: 'custom',
                message: 'The passwords did not match',
                path: ['confirmPassword']
            });
        }
    });

export const RegisterValidation = (data: IRegister): Array<IZodError> | string => {
    return ModelValidation(data, RegisterSchema);
};
