import { apiDelete, apiGet, apiPost, apiPut } from './apiClient'
import type { CreateGroupRequest, GroupModel, UpdateGroupRequest } from '@/types/formation'

export function getGroups(): Promise<GroupModel[]> {
  return apiGet<GroupModel[]>('/Groups')
}

export function getGroupsByFormation(formationId: string): Promise<GroupModel[]> {
  return apiGet<GroupModel[]>(`/Groups?formationId=${encodeURIComponent(formationId)}`)
}

export function getGroupById(id: string): Promise<GroupModel> {
  return apiGet<GroupModel>(`/Groups/${id}`)
}

export function createGroup(data: CreateGroupRequest): Promise<GroupModel> {
  return apiPost<GroupModel>('/Groups', data)
}

export function updateGroup(id: string, data: UpdateGroupRequest): Promise<GroupModel> {
  return apiPut<GroupModel>(`/Groups/${id}`, data)
}

export function deleteGroup(id: string): Promise<string> {
  return apiDelete<string>(`/Groups/${id}`)
}

// Compatibility hook for legacy hooks that used useGroupService
export function useGroupService() {
  return { getGroups, getGroupById, createGroup, updateGroup, deleteGroup }
}
