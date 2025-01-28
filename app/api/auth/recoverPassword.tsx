import { IRecover, IRecoverPassword } from '@interfaces/IAuth';
import { env } from '@config/env';

import axios from 'axios';

export const recoverPassword = async (recoverPassword: IRecover): Promise<IRecoverPassword> => {
    const response = await axios
        .post(`${env.NEXT_PUBLIC_API_URL_BACKEND}/mail`, recoverPassword)
        .then((response) => {
            return {
                code: response.status,
                message: 'Verifique su correo electronico.'
            };
        })
        .catch(function (error) {
            if (error && error.response) {
                if (error.response.status === 404) {
                    return {
                        code: error.response.status,
                        message: 'Usuario no encontrado.'
                    };
                }
            }
            return {
                code: error.response.status,
                message: 'Contacte con soporte.'
            };
        });

    return response;
};
