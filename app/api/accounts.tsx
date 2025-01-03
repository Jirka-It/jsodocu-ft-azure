import axiosInstance from '../../axios';
import { env } from '@config/env';
import { IAccount, IAccountPartial, IAccountResponse, IAccountResponseObject } from '@interfaces/IAccount';

const findAll = async (params: any): Promise<IAccountResponse> => {
    return await axiosInstance
        .get(`${env.NEXT_PUBLIC_API_URL_BACKEND}/accounts`, {
            params: params
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

const findById = async (id: string): Promise<IAccountResponseObject> => {
    return await axiosInstance
        .get(`${env.NEXT_PUBLIC_API_URL_BACKEND}/accounts/${id}`)
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

const create = async (data: IAccount): Promise<IAccountResponseObject> => {
    return await axiosInstance
        .post(`${env.NEXT_PUBLIC_API_URL_BACKEND}/accounts`, data)
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

const update = async (id: string, data: IAccountPartial): Promise<IAccountResponse> => {
    return await axiosInstance
        .put(`${env.NEXT_PUBLIC_API_URL_BACKEND}/accounts/${id}`, data)
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

const remove = async (id: string): Promise<IAccountResponse> => {
    return await axiosInstance
        .delete(`${env.NEXT_PUBLIC_API_URL_BACKEND}/accounts/${id}`)
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

export { findAll, findById, create, update, remove };
