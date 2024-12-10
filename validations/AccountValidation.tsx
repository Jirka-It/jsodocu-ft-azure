import { z } from 'zod';
import { ModelValidation } from './ModelValidation';
import { IZodError } from '@interfaces/IAuth';
import { IAccount } from '@interfaces/IAccount';

const AccountSchema = z.object({
    username: z.string().min(1),
    corporateEmail: z.string().email().min(1),
    phone: z.string().min(1),
    password: z.string().min(1),
    role: z.string().min(1)
});

export const AccountValidation = (data: IAccount): Array<IZodError> | string => {
    return ModelValidation(data, AccountSchema);
};
