import axiosInstance from '../../axios';
import { env } from '@config/env';
import { IVariable, IVariableLightResponse, IVariablePartial, IVariableResponse, IVariableResponseObject } from '@interfaces/IVariable';

const findAll = async (params: any): Promise<IVariableResponse> => {
    return await axiosInstance
        .get(`${env.NEXT_PUBLIC_API_URL_BACKEND}/variables`, {
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

const findAllWithOutPagination = async (params: any): Promise<IVariableLightResponse> => {
    return await axiosInstance
        .get(`${env.NEXT_PUBLIC_API_URL_BACKEND}/variables/with-out-pagination`, {
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

const findById = async (id: string): Promise<IVariableResponseObject> => {
    return await axiosInstance
        .get(`${env.NEXT_PUBLIC_API_URL_BACKEND}/variables/${id}`)
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

const findByName = async (id: string, name: string): Promise<boolean> => {
    return await axiosInstance
        .get(`${env.NEXT_PUBLIC_API_URL_BACKEND}/variables/${id}/is-unique`, {
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

const create = async (data: IVariable): Promise<IVariableResponseObject> => {
    return await axiosInstance
        .post(`${env.NEXT_PUBLIC_API_URL_BACKEND}/variables`, data)
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

const update = async (id: string, data: IVariablePartial): Promise<IVariableResponseObject> => {
    return await axiosInstance
        .put(`${env.NEXT_PUBLIC_API_URL_BACKEND}/variables/${id}`, data)
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

const remove = async (id: string): Promise<IVariableResponseObject> => {
    return await axiosInstance
        .delete(`${env.NEXT_PUBLIC_API_URL_BACKEND}/variables/${id}`)
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

export { findAll, findAllWithOutPagination, findById, findByName, create, update, remove };
