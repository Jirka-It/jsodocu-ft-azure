import { ZodSchema } from 'zod';
import { LoginMessages } from '@enums/LoginEnum';
import { IZodError } from '@/interfaces/IAuth';

export const ModelValidation = (inf: unknown, schema: ZodSchema) => {
    try {
        schema.parse(inf);
        return LoginMessages.VALIDATION_PASSED;
    } catch (e) {
        try {
            const errors: Array<IZodError> = JSON.parse(e);

            if (errors && errors.length > 0) {
                return errors;
            }
        } catch (error) {
            return LoginMessages.GENERIC_ERROR;
        }
    }
};
