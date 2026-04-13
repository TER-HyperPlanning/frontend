import { useCallback } from 'react';
import type { ApiResponse } from '@/services/apiClient';
import { useAppClient } from '@/hooks/api/useAppClient';

export type Building = {
    id: string
    name: string;
};

export function useBuildingService() {
    const { api } = useAppClient();

   
    const getBuildings = useCallback(
        (q?: string) =>
            api
                .get<ApiResponse<Array<Building>>>('/Buildings', {
                    params: q ? { q } : {},
                })
                .then((r) => r.data.result),
        [api],
    );

    const createBuilding = useCallback(
        (name: string) => api.post<ApiResponse<Building>>('/Buildings', { name }).then((r) => r.data.result),
        [api],
    );

    const updateBuilding = useCallback(
        (id: string, name: string) => api.put<ApiResponse<Building>>(`/Buildings/${id}`, { name }).then((r) => r.data.result),
        [api],
    );

    const deleteBuilding = useCallback(
        (id: string) => api.delete<ApiResponse<string>>(`/Buildings/${id}`).then((r) => r.data.result),
        [api],
    );

    return { getBuildings, createBuilding, updateBuilding, deleteBuilding };
}