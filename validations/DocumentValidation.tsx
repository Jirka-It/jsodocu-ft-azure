import { z } from 'zod';
import { ModelValidation } from './ModelValidation';
import { IZodError } from '@interfaces/IAuth';
import { IDocumentPartial } from '@interfaces/IDocument';

const DocumentSchema = z.object({
    name: z.string().min(1),
    type: z.string().min(1)
    //template: z.string().min(1)
});

export const DocumentValidation = (data: IDocumentPartial): Array<IZodError> | string => {
    return ModelValidation(data, DocumentSchema);
};
