import { z } from 'zod';
import { ModelValidation } from './ModelValidation';
import { IZodError } from '@interfaces/IAuth';
import { IComment } from '@interfaces/IComment';

const CommentSchema = z.object({
    description: z.string().min(1)
});

export const CommentValidation = (data: IComment): Array<IZodError> | string => {
    return ModelValidation(data, CommentSchema);
};
