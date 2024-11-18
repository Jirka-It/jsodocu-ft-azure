import { z } from 'zod';
import { ModelValidation } from './ModelValidation';
import { IZodError } from '@interfaces/IAuth';
import { ICategory } from '@interfaces/ICategory';

const CategorySchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    state: z.string().min(1)
});

export const CategoryValidation = (data: ICategory): Array<IZodError> | string => {
    return ModelValidation(data, CategorySchema);
};
