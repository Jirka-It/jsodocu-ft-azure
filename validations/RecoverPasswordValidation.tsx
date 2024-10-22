import { z } from 'zod';
import { ModelValidation } from './ModelValidation';
import { IRecover, IZodError } from '@interfaces/IAuth';

const RegisterSchema = z.object({
    email: z.string().email().min(1)
});

export const RecoverValidation = (data: IRecover): Array<IZodError> | string => {
    return ModelValidation(data, RegisterSchema);
};
