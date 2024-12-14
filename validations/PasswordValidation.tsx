import { z } from 'zod';
import { ModelValidation } from './ModelValidation';
import { IZodError } from '@interfaces/IAuth';
import { IUserPassword } from '@interfaces/IUser';

const PasswordSchema = z
    .object({
        password: z.string().min(1).optional(),
        confirmPassword: z.string().min(1).optional()
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

export const PasswordValidation = (data: IUserPassword): Array<IZodError> | string => {
    return ModelValidation(data, PasswordSchema);
};
