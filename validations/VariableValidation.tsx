import { z } from 'zod';
import { ModelValidation } from './ModelValidation';
import { IZodError } from '@interfaces/IAuth';
import { IVariable } from '@interfaces/IVariable';

const VariableSchema = z.object({
    name: z.string().min(1),
    category: z.string().min(1)
});

export const VariableValidation = (data: IVariable): Array<IZodError> | string => {
    return ModelValidation(data, VariableSchema);
};
