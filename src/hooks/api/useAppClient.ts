import axios, {
    type AxiosInstance,
    type AxiosError,
    type InternalAxiosRequestConfig,
} from 'axios';
import { useMemo } from 'react';
import { getApiBaseUrl } from '@/config/api';

/**
 * Hook retournant une instance Axios authentifiée (Bearer JWT).
 * Injecte automatiquement le token depuis localStorage.
 * Gère les erreurs 401 en nettoyant la session et redirigeant vers /auth/login.
 */
export function useAppClient() {
    const api: AxiosInstance = useMemo(() => {
        const instance = axios.create({
            baseURL: getApiBaseUrl(),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Intercepteur de requête : injecte le Bearer token
        instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = localStorage.getItem('accessToken');

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error),
        );

        // Intercepteur de réponse : gère les 401/403
        instance.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('expiresIn');
                    localStorage.removeItem('currentUser');
                    window.location.href = '/auth/login';
                }

                return Promise.reject(error);
            },
        );

        return instance;
    }, []);

    return { api };
}
