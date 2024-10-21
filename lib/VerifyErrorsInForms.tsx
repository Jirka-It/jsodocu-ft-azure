import { IZodError } from '@/interfaces/ILogin';

export const VerifyErrorsInForms = (errors: Array<IZodError>, fieldName: string): boolean => {
    try {
        return errors.some((e) => e.path[0] === fieldName);
    } catch (error) {
        return true;
    }
};
