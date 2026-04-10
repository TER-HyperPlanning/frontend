import React from 'react'
import Logo from '@/components/Logo'
import Select from '@/components/ui/Select'
import { getAccessToken } from '@/auth/storage'
import { useQuery } from '@tanstack/react-query'
import { useAppClient } from '@/hooks/api/useAppClient'
import { apiGet } from '@/services/apiClient'
import type { ProgramModel, TrackResponse } from '@/types/formation'
import PageHeader from '@/layout/page-header/PageHeader'
import { BellIcon } from 'lucide-react'

type ApiResponse<T> = { status: string | null; message: string | null; result: T }

interface GroupModel {
  id: string
  name: string
  academicYear: string | null
  trackId: string | null
}

export interface PlanningHeaderProps {
  programId: string
  trackId: string
  groupId: string
  onProgramChange: (id: string) => void
  onTrackChange: (id: string) => void
  onGroupChange: (id: string) => void
}

function usePlanningPrograms() {
  const hasToken = !!getAccessToken()
  const appClient = hasToken ? useAppClient() : null

  return useQuery<ProgramModel[]>({
    queryKey: ['programs'],
    queryFn: async () => {
      if (appClient) {
        const { data } = await appClient.api.get<ApiResponse<ProgramModel[]>>('/Programs')
        return data.result ?? []
      }
      return (await apiGet<ProgramModel[]>('/Programs')) ?? []
    },
  })
}

function usePlanningTracks() {
  const hasToken = !!getAccessToken()
  const appClient = hasToken ? useAppClient() : null

  return useQuery<TrackResponse[]>({
    queryKey: ['tracks'],
    queryFn: async () => {
      if (appClient) {
        const { data } = await appClient.api.get<ApiResponse<TrackResponse[]>>('/Tracks')
        return data.result ?? []
      }
      return (await apiGet<TrackResponse[]>('/Tracks')) ?? []
    },
  })
}

function usePlanningGroups() {
  const hasToken = !!getAccessToken()
  const appClient = hasToken ? useAppClient() : null

  return useQuery<GroupModel[]>({
    queryKey: ['groups'],
    queryFn: async () => {
      if (appClient) {
        const { data } = await appClient.api.get<ApiResponse<GroupModel[]>>('/Groups')
        return data.result ?? []
      }
      return (await apiGet<GroupModel[]>('/Groups')) ?? []
    },
  })
}

function PlanningHeader({
  programId,
  trackId,
  groupId,
  onProgramChange,
  onTrackChange,
  onGroupChange,
}: PlanningHeaderProps) {
  const { data: programs = [] } = usePlanningPrograms()
  const { data: tracks = [] } = usePlanningTracks()
  const { data: groups = [] } = usePlanningGroups()

  const defaultProgramId = programs[0]?.id ?? ''
  const effectiveProgramId = programId || defaultProgramId
  const defaultTrackId =
    tracks.find((t) => t.programId === effectiveProgramId)?.id ?? ''
  const effectiveTrackId = trackId || defaultTrackId

  const filteredTracks = programId
    ? tracks.filter((t) => t.programId === programId)
    : tracks

  const filteredGroups = trackId
    ? groups.filter((g) => g.trackId === trackId)
    : groups

  React.useEffect(() => {
    if (programId || !defaultProgramId) return
    onProgramChange(defaultProgramId)
  }, [programId, defaultProgramId, onProgramChange])

  React.useEffect(() => {
    if (trackId || !defaultTrackId) return
    onTrackChange(defaultTrackId)
  }, [trackId, defaultTrackId, onTrackChange])

  React.useEffect(() => {
    if (groupId || !effectiveTrackId) return
    const defaultGroupId = groups.find((g) => g.trackId === effectiveTrackId)?.id ?? ''
    if (!defaultGroupId) return
    onGroupChange(defaultGroupId)
  }, [groupId, effectiveTrackId, groups, onGroupChange])

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onProgramChange(e.target.value)
    onTrackChange('')
    onGroupChange('')
  }

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTrackChange(e.target.value)
    onGroupChange('')
  }

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onGroupChange(e.target.value)
  }

  return (
    <PageHeader>
      <Logo showText={true} className="h-10 w-auto text-primary-700" />

      <div className="flex flex-wrap items-center justify-end md:justify-start gap-2 ml-2 md:ml-4 flex-1">
        <Select
          items={programs.map((p) => ({ id: p.id, value: p.name }))}
          value={programId}
          onChange={handleProgramChange}
          placeholder="Filière"
          className="select-sm rounded-full max-w-[150px]"
        />
        <Select
          items={filteredTracks.map((t) => ({ id: t.id, value: t.name }))}
          value={trackId}
          onChange={handleTrackChange}
          placeholder="Formation"
          className="select-sm rounded-full max-w-[150px]"
        />
        <Select
          items={filteredGroups.map((g) => ({ id: g.id, value: g.name }))}
          value={groupId}
          onChange={handleGroupChange}
          placeholder="Groupe"
          className="select-sm rounded-full max-w-[150px]"
        />
      </div>

      <button className="btn btn-ghost btn-circle btn-sm">
        <BellIcon className="w-5 h-5 text-gray-600" />
      </button>
    </PageHeader>
  )
}

export default PlanningHeader
