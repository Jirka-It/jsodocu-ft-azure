import axiosInstance from '../../axios';
import { env } from '@config/env';
import { ICategory, ICategoryPartial, ICategoryResponse, IChapterResponseObject } from '@interfaces/ICategory';

const findAll = async (params: any): Promise<ICategoryResponse> => {
    return await axiosInstance
        .get(`${env.NEXT_PUBLIC_API_URL_BACKEND}/categories`, {
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

const findById = async (id: string): Promise<IChapterResponseObject> => {
    return await axiosInstance
        .get(`${env.NEXT_PUBLIC_API_URL_BACKEND}/categories/${id}`)
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

const findByName = async (name: string): Promise<boolean> => {
    return await axiosInstance
        .get(`${env.NEXT_PUBLIC_API_URL_BACKEND}/categories/is-unique`, {
            params: { name }
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

const create = async (data: ICategory): Promise<IChapterResponseObject> => {
    return await axiosInstance
        .post(`${env.NEXT_PUBLIC_API_URL_BACKEND}/categories`, data)
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

const update = async (id: string, data: ICategoryPartial): Promise<IChapterResponseObject> => {
    return await axiosInstance
        .put(`${env.NEXT_PUBLIC_API_URL_BACKEND}/categories/${id}`, data)
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

const remove = async (id: string): Promise<IChapterResponseObject> => {
    return await axiosInstance
        .delete(`${env.NEXT_PUBLIC_API_URL_BACKEND}/categories/${id}`)
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

export { findAll, findById, findByName, create, update, remove };
