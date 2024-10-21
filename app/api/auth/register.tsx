import { IRegister, IRegisterResponse } from '@interfaces/IAuth';
import { env } from '@config/env';

import axios from 'axios';

export const registerUser = async (registerUser: IRegister): Promise<IRegisterResponse> => {
    const response = await axios
        .post(`${env.NEXT_PUBLIC_API_URL}/auth/register`, registerUser)
        .then((response) => {
            return {
                code: response.status,
                message: 'Usuario creado.'
            };
        })
        .catch(function (error) {
            try {
                if (error && error.response) {
                    if (error.response.status === 400) {
                        if (error.response.data.message.includes('duplicate')) {
                            return {
                                code: error.response.status,
                                message: 'Ya existe este usuario, verifique los datos ingresados.'
                            };
                        }
                    }

                    return {
                        code: error.response.status,
                        message: 'Verifique los datos ingresados'
                    };
                }
            } catch (error) {
                return {
                    code: 500,
                    message: 'Contacte con soporte.'
                };
            }
        });

    return response;
};
