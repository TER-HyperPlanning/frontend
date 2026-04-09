import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { clearSession, getAccessToken, getStoredCurrentUser, setSession, setStoredCurrentUser } from '@/auth/storage'
import { useAuthClient } from './useAuthClient'
import { useAppClient } from './useAppClient'

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

export const authKeys = {
    currentUser: ['auth', 'currentUser'] as const,
}

// ── Hook ────────────────────────────────────────────────────────────────

export function useAuth() {
    const navigate = useNavigate();
    const authApi = useAuthClient();
    const queryClient = useQueryClient()

    const loginMutation = useMutation({
        mutationFn: async (credentials: LoginRequest) => {
            const { data } = await authApi.post<ApiResponse<LoginResponse>>(
                '/Auth/login',
                credentials,
            )

            if (!data.result?.accessToken) {
                const message = data.message ?? 'Échec de la connexion'
                throw new Error(message)
            }

            setSession(data.result.accessToken, data.result.expiresIn)
            return data.result
        },
        onSuccess: async (result) => {
            await queryClient.fetchQuery({
                queryKey: authKeys.currentUser,
                queryFn: async () => {
                    const baseURL = import.meta.env.VITE_API_URL || "https://hyper-planning.fr/api"
                    const { data } = await axios.get<ApiResponse<CurrentUserResponse>>(
                        `${baseURL}/Auth/current-user`,
                        {
                            headers: { Authorization: `Bearer ${result.accessToken}` },
                        },
                    )
                    setStoredCurrentUser(data.result)
                    return data.result
                },
            })
        },
        onError: () => {
            clearSession()
        },
    })

    /**
     * Déconnecte l'utilisateur (supprime le token et redirige vers /auth/login).
     */
    const logout = () => {
        clearSession()
        queryClient.removeQueries({ queryKey: authKeys.currentUser })
        navigate({ to: '/auth/login' });
    };

    /**
     * Vérifie si un token est actuellement stocké.
     */
    const isAuthenticated = (): boolean => {
        return !!getAccessToken()
    };

    return {
        login: async (credentials: LoginRequest): Promise<boolean> => {
            try {
                await loginMutation.mutateAsync(credentials)
                return true
            } catch {
                return false
            }
        },
        logout,
        isAuthenticated,
        isLoading: loginMutation.isPending,
        error: loginMutation.error instanceof Error ? loginMutation.error.message : null,
    };
}

export function useCurrentUser() {
    const { api } = useAppClient()

    return useQuery({
        queryKey: authKeys.currentUser,
        enabled: !!getAccessToken(),
        initialData: () => getStoredCurrentUser<CurrentUserResponse>() ?? undefined,
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<CurrentUserResponse>>('/Auth/current-user')
            setStoredCurrentUser(data.result)
            return data.result
        },
        staleTime: 5 * 60 * 1000,
    })
}
