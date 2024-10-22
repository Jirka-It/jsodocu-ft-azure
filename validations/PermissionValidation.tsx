import { z } from 'zod';
import { ModelValidation } from './ModelValidation';
import { IZodError } from '@/interfaces/IAuth';
import { IPermission } from '@interfaces/IPermission';

const PermissionSchema = z.object({
    code: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    category: z.string().min(1)
});

export const PermissionValidation = (login: IPermission): Array<IZodError> | string => {
    return ModelValidation(login, PermissionSchema);
};
