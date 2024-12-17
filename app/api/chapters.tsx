import axiosInstance from '../../axios';
import { env } from '@config/env';
import { IChapter, IChapterPartial, IChapterResponse, IChapterResponseCreate } from '@interfaces/IChapter';

const findAll = async (params: any): Promise<IChapterResponse> => {
    return await axiosInstance
        .get(`${env.NEXT_PUBLIC_API_URL_BACKEND}/doc-chapters`, {
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

const findAllPreview = async (params: any): Promise<string> => {
    return await axiosInstance
        .get(`${env.NEXT_PUBLIC_API_URL_BACKEND}/doc-chapters/preview`, {
            params: params
        })
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return error;
        });
};

const findById = async (id: string): Promise<IChapterResponse> => {
    return await axiosInstance
        .get(`${env.NEXT_PUBLIC_API_URL_BACKEND}/doc-chapters/${id}`)
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

const create = async (data: IChapter): Promise<IChapterResponseCreate> => {
    return await axiosInstance
        .post(`${env.NEXT_PUBLIC_API_URL_BACKEND}/doc-chapters`, data)
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

const update = async (id: string, data: IChapterPartial): Promise<IChapterResponse> => {
    return await axiosInstance
        .put(`${env.NEXT_PUBLIC_API_URL_BACKEND}/doc-chapters/${id}`, data)
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

const remove = async (id: string): Promise<IChapterResponse> => {
    return await axiosInstance
        .delete(`${env.NEXT_PUBLIC_API_URL_BACKEND}/doc-chapters/${id}`)
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

export { findAll, findAllPreview, findById, create, update, remove };
