import { z } from 'zod';
import { ModelValidation } from './ModelValidation';
import { IZodError } from '@interfaces/IAuth';
import { IDocType } from '@interfaces/IDocType';

const DocumentTypeSchema = z.object({
    code: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    state: z.string().min(1)
});

export const DocumentTypeValidation = (data: IDocType): Array<IZodError> | string => {
    return ModelValidation(data, DocumentTypeSchema);
};
