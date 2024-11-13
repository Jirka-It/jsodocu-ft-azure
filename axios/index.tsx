import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL_BACKEND, // Replace with your API base URL
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        const session = (await getSession()) as any;
        const token = session ? session.access_token : null;

        // Edit request config
        config.headers.get['Content-Type'] = 'application/json';
        if (token) {
            config.headers.authorization = token ? `Bearer ${token}` : '';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        // Edit response config
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            signOut({ callbackUrl: '/auth/login', redirect: true });
        } else {
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
