import axiosInstance from '../../axios';
import { env } from '@config/env';
import { IDocType, IDocTypePartial, IDocTypeResponse, IDocTypeResponseObject } from '@interfaces/IDocType';

const findAll = async (params: any): Promise<IDocTypeResponse> => {
    return await axiosInstance
        .get(`${env.NEXT_PUBLIC_API_URL_BACKEND}/doc-types`, {
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

const findById = async (id: string): Promise<IDocTypeResponseObject> => {
    return await axiosInstance
        .get(`${env.NEXT_PUBLIC_API_URL_BACKEND}/doc-types/${id}`)
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

const findByCode = async (code: string): Promise<boolean> => {
    return await axiosInstance
        .get(`${env.NEXT_PUBLIC_API_URL_BACKEND}/doc-types/is-unique`, {
            params: { code }
        })
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return {
                code: error.code,
                status: error.status
            };
        });
};

const create = async (data: IDocType): Promise<IDocTypeResponseObject> => {
    return await axiosInstance
        .post(`${env.NEXT_PUBLIC_API_URL_BACKEND}/doc-types`, data)
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

const update = async (id: string, data: IDocTypePartial): Promise<IDocTypeResponseObject> => {
    return await axiosInstance
        .put(`${env.NEXT_PUBLIC_API_URL_BACKEND}/doc-types/${id}`, data)
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

const remove = async (id: string): Promise<IDocTypeResponseObject> => {
    return await axiosInstance
        .delete(`${env.NEXT_PUBLIC_API_URL_BACKEND}/doc-types/${id}`)
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

export { findAll, findById, findByCode, create, update, remove };
