import axios from 'axios';
import axiosInstance from '../../axios';

import { getSession } from 'next-auth/react';
import { env } from '@config/env';

const create = async () => {
    const res = await axios.post(`${env.NEXT_PUBLIC_API_URL_BACKEND}/documents`, {
        name: 'Documento nuevo',
        version: 1,
        type: '6733c847157c32d1c1dae550',
        creator: '6715cf28b9090963b763ddca',
        reviewer: '67182fee34b676c604329379',
        state: 'ACTIVE'
    });

    return res;
};

const findAll = async (params = { page: 1, size: 5 }) => {
    return await axiosInstance
        .get(`${env.NEXT_PUBLIC_API_URL_BACKEND}/documents`, {
            params: params
        })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            return error;
        });
};

export { findAll };
