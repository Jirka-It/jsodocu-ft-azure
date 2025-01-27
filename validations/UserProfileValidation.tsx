import { z } from 'zod';
import { ModelValidation } from './ModelValidation';
import { IZodError } from '@interfaces/IAuth';
import { IUser } from '@interfaces/IUser';

const UserSchema = z.object({
    name: z.string().min(1),
    lastName: z.string().min(1)
});

export const UserProfileValidation = (data): Array<IZodError> | string => {
    return ModelValidation(data, UserSchema);
};
