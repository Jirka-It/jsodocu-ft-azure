import { z } from 'zod';
import { ModelValidation } from './ModelValidation';
import { IZodError } from '@interfaces/IAuth';
import { IUser } from '@interfaces/IUser';

const arraySchema = z.object({
    name: z.string().min(1),
    code: z.string().min(1)
});

const UserSchema = z
    .object({
        name: z.string().min(1),
        lastName: z.string().min(1),
        username: z.string().email().min(1),
        password: z.string().min(1),
        confirmPassword: z.string().min(1),
        state: z.string().min(1),
        roles: z.array(arraySchema).nonempty().min(1)
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
