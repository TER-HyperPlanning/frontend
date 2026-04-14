import axios, { type AxiosInstance } from 'axios';
import { useMemo } from 'react';
import { getApiBaseUrl } from '@/config/api';

/**
 * Hook retournant une instance Axios publique (sans token).
 * À utiliser pour les endpoints d'authentification (login, etc.)
 */
export function useAuthClient() {
    const authApi: AxiosInstance = useMemo(
        () =>
            axios.create({
                baseURL: getApiBaseUrl(),
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        [],
    );

    return authApi;
}
