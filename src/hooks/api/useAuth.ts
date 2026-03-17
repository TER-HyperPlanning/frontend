import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthClient } from './useAuthClient';

// ── Types basés sur le Swagger ──────────────────────────────────────────

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string | null;
    expiresIn: number;
}

export interface CurrentUserResponse {
    id: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
    role: string | null;
    createdAt: string;
}

export interface ApiResponse<T> {
    status: string | null;
    message: string | null;
    result: T;
}

// ── Hook ────────────────────────────────────────────────────────────────

export function useAuth() {
    const navigate = useNavigate();
    const authApi = useAuthClient();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Connecte l'utilisateur et stocke le token JWT.
     */
    const login = async (credentials: LoginRequest): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const { data } = await authApi.post<ApiResponse<LoginResponse>>(
                '/Auth/login',
                credentials,
            );

            if (data.result?.accessToken) {
                localStorage.setItem('accessToken', data.result.accessToken);
                localStorage.setItem('expiresIn', String(data.result.expiresIn));
                return true;
            }

            setError(data.message ?? 'Échec de la connexion');
            return false;
        } catch (err: any) {
            const message =
                err.response?.data?.message ?? 'Une erreur est survenue lors de la connexion';
            setError(message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Déconnecte l'utilisateur (supprime le token et redirige vers /auth/login).
     */
    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('expiresIn');
        navigate({ to: '/auth/login' });
    };

    /**
     * Vérifie si un token est actuellement stocké.
     */
    const isAuthenticated = (): boolean => {
        return !!localStorage.getItem('accessToken');
    };

    return {
        login,
        logout,
        isAuthenticated,
        isLoading,
        error,
    };
}
