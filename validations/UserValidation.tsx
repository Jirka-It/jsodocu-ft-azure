import { z } from 'zod';
import { ModelValidation } from './ModelValidation';
import { IZodError } from '@interfaces/IAuth';
import { IUser } from '@interfaces/IUser';

const UserSchema = z
    .object({
        name: z.string().min(1),
        lastName: z.string().min(1),
        username: z.string().email().min(1),
        password: z.string().regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{8,}$')),
        confirmPassword: z.string().regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{8,}$')),
        accountId: z.string().min(1).optional(),
        state: z.string().min(1),
        roles: z.array(z.string()).nonempty().min(1)
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

export const UserValidation = (data: IUser): Array<IZodError> | string => {
    return ModelValidation(data, UserSchema);
};
