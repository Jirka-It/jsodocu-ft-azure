import axiosInstance from '../../axios';
import { env } from '@config/env';
import { IFile, IFileResponse } from '@interfaces/IFile';

const headersFile = {
    'Content-Type': 'multipart/form-data'
};

const findFile = async (data: IFile): Promise<any> => {
    return await axiosInstance
        .post(`${env.NEXT_PUBLIC_API_URL_BACKEND}/file-upload/get-file`, data, { responseType: 'blob' })
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

const create = async (data: any): Promise<IFile> => {
    return await axiosInstance
        .post(`${env.NEXT_PUBLIC_API_URL_BACKEND}/file-upload`, data, {
            headers: headersFile
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

const remove = async (data: IFile): Promise<IFileResponse> => {
    return await axiosInstance
        .post(`${env.NEXT_PUBLIC_API_URL_BACKEND}/file-upload/delete`, data)
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

export { findFile, create, remove };
