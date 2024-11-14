import axios from 'axios';
import axiosInstance from '../../axios';
import { env } from '@config/env';
import { IDocumentResponse } from '@interfaces/IDocument';

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

const findAll = async (page: number = 1, size: number = 5): Promise<IDocumentResponse> => {
    return await axiosInstance
        .get(`${env.NEXT_PUBLIC_API_URL_BACKEND}/documents`, {
            params: { page, size }
        })
        .then((res) => {
            return {
                ...res.data,
                status: res.status
            };
        })
        .catch((error) => {
            return {
                code: error.code,
                status: error.status
            };
        });
};

const remove = async (id: string): Promise<IDocumentResponse> => {
    return await axiosInstance
        .delete(`${env.NEXT_PUBLIC_API_URL_BACKEND}/documents/${id}`)
        .then((res) => {
            return {
                ...res.data,
                status: res.status
            };
        })
        .catch((error) => {
            return {
                code: error.code,
                status: error.status
            };
        });
};

export { findAll, remove };
