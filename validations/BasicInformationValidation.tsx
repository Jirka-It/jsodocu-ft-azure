import { z } from 'zod';
import { ModelValidation } from './ModelValidation';
import { IZodError } from '@interfaces/IAuth';
import { IBasicInformation } from '@interfaces/IBasicInformation';

const BasicInformationSchema = z.object({
    name: z.string().min(1),
    nit: z.string().min(1),
    email: z.string().min(1),
    alternateEmail: z.string().min(1),
    website: z.string().min(1),
    city: z.string().min(1)
});

export const BasicInformationValidation = (data: IBasicInformation): Array<IZodError> | string => {
    return ModelValidation(data, BasicInformationSchema);
};
