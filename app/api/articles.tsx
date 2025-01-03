import axiosInstance from '../../axios';
import { env } from '@config/env';
import { IArticle, IArticlePartial, IArticleResponse, IArticleResponseObject } from '@interfaces/IArticle';

const findAll = async (params: any): Promise<IArticleResponse> => {
    return await axiosInstance
        .get(`${env.NEXT_PUBLIC_API_URL_BACKEND}/doc-articles`, {
            params: params
        })
        .then((res) => {
            return {
                data: res.data,
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

const findById = async (id: string): Promise<IArticleResponseObject> => {
    return await axiosInstance
        .get(`${env.NEXT_PUBLIC_API_URL_BACKEND}/doc-articles/${id}`)
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

const create = async (data: IArticle): Promise<IArticleResponseObject> => {
    return await axiosInstance
        .post(`${env.NEXT_PUBLIC_API_URL_BACKEND}/doc-articles`, data)
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

const update = async (id: string, data: IArticlePartial): Promise<IArticleResponseObject> => {
    return await axiosInstance
        .put(`${env.NEXT_PUBLIC_API_URL_BACKEND}/doc-articles/${id}`, data)
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

const remove = async (id: string): Promise<IArticleResponseObject> => {
    return await axiosInstance
        .delete(`${env.NEXT_PUBLIC_API_URL_BACKEND}/doc-articles/${id}`)
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
