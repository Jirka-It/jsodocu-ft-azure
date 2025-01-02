import { IZodError } from '@interfaces/IAuth';
import { LoginMessages } from '@enums/LoginEnum';
import { showError } from '@lib/ToastMessages';

export const ValidationFlow = (validation: any, toast: any): Array<IZodError> | [] => {
    let validations: Array<IZodError> | [] = [];

    if (typeof validation === 'string') {
        if (validation !== LoginMessages.VALIDATION_PASSED) {
            // Add toast message
            showError(toast, '', 'Contacte con soporte.');
            return [
                {
                    code: LoginMessages.VALIDATION_NOT_PASSED,
                    message: LoginMessages.VALIDATION_NOT_PASSED,
                    path: [LoginMessages.VALIDATION_NOT_PASSED],
                    validation: LoginMessages.VALIDATION_NOT_PASSED
                }
            ];
        } else {
            return [];
        }
    }
    if (Array.isArray(validation)) {
        // Add toast message

        const arrayValidation = validation.find((v) => v.code === 'too_small' && v.type === 'array');

        if (arrayValidation) {
            showError(toast, '', 'Verifique la información ingresada y si añadió permisos al rol.');
        } else {
            showError(toast, '', 'Verifique la información ingresada.');
        }

        // Change color of inputs
        validations = validation;
        return validations;
    }
};
