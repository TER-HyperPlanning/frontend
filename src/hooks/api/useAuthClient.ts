import axios, { type AxiosInstance } from 'axios';
import { useMemo } from 'react';

/**
 * Hook retournant une instance Axios publique (sans token).
 * À utiliser pour les endpoints d'authentification (login, etc.)
 */
export function useAuthClient() {
    const authApi: AxiosInstance = useMemo(
        () =>
            axios.create({
                baseURL: import.meta.env.VITE_API_URL || "https://hyper-planning.fr/api",
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        [],
    );

    return authApi;
}
