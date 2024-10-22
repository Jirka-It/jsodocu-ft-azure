import { z } from 'zod';
import { ModelValidation } from './ModelValidation';
import { IZodError } from '@/interfaces/IAuth';
import { IRol } from '@interfaces/IRol';

const RolSchema = z.object({
    code: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    permission: z.string().min(1)
});

export const RolValidation = (data: IRol): Array<IZodError> | string => {
    return ModelValidation(data, RolSchema);
};
