import { z } from 'zod';
import { ModelValidation } from './ModelValidation';
import { IRegister, IZodError } from '@interfaces/IAuth';

const RegisterSchema = z
    .object({
        name: z.string().min(1),
        lastName: z.string().min(1),
        username: z.string().email().min(1),
        password: z.string().regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{8,}$')),
        confirmPassword: z.string().regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{8,}$')),
        state: z.string().min(1)
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
