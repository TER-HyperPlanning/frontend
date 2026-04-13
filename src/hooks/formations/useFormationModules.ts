import { useState, useEffect, useCallback } from 'react'
import { type TrackResponse } from '@/types/formation'
import { useTrackService } from '@/services/trackService'
import { useProgramService } from '@/services/programService'
import { useAssignService, type AssignResponse } from '@/services/assignService'
import { type CourseResponse } from '@/types/session'
import { useCourseService } from '@/services/courseService'

export interface FormationModuleRow {
  id: string
  name: string
  code: string
  hourlyVolume: number
  trackName: string
}

export function useFormationModules(formationId: string) {
  const { getProgramById } = useProgramService()
  const { getTracks } = useTrackService()
  const { getAssigns } = useAssignService()
  const { getCourses } = useCourseService()

  const [modules, setModules] = useState<FormationModuleRow[]>([])
  const [formationName, setFormationName] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const fetchModules = useCallback(async () => {
    setIsLoading(true)
    try {
      const [program, allTracks, allAssigns, allCourses] = await Promise.all([
        getProgramById(formationId).catch(() => null),
        getTracks().catch(() => [] as TrackResponse[]),
        getAssigns().catch(() => [] as AssignResponse[]),
        getCourses().catch(() => [] as CourseResponse[]),
      ])

      setFormationName(program?.name ?? '')

      const trackIds = new Set(
        allTracks.filter((t) => t.programId === formationId).map((t) => t.id),
      )
      const trackMap = new Map(allTracks.map((t) => [t.id, t.name]))
      const courseMap = new Map(allCourses.map((c) => [c.id, c]))

      const rows: FormationModuleRow[] = allAssigns
        .filter((a) => trackIds.has(a.trackId))
        .map((a) => {
          const course = courseMap.get(a.courseId)
          return {
            id: `${a.trackId}_${a.courseId}`,
            name: course?.name ?? '—',
            code: course?.code ?? '—',
            hourlyVolume: a.hourlyVolume,
            trackName: trackMap.get(a.trackId) ?? '—',
          }
        })

      setModules(rows)
    } catch {
      setModules([])
    } finally {
      setIsLoading(false)
    }
  }, [formationId, getProgramById, getTracks, getAssigns, getCourses])

  useEffect(() => {
    fetchModules()
  }, [fetchModules])

  return { modules, formationName, isLoading, refetch: fetchModules }
}
