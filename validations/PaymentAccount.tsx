import { z } from 'zod';
import { ModelValidation } from './ModelValidation';
import { IZodError } from '@interfaces/IAuth';
import { IPaymentAccount } from '@interfaces/IPaymentAccount';

const PaymentAccountSchema = z.object({
    name: z.string().min(1),
    lastName: z.string().min(1),
    cardNumber: z.number().min(1),
    email: z.string().email().min(1),
    month: z.date(),
    year: z.date(),
    code: z.number().min(1)
});

export const PaymentAccountValidation = (data: IPaymentAccount): Array<IZodError> | string => {
    return ModelValidation(data, PaymentAccountSchema);
};
