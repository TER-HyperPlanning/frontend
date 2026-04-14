import { useState, useEffect, useCallback } from 'react'
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
  /** Filière (Program) rattachée à la formation */
  filiereName: string
}

export function useFormationModules(formationId: string) {
  const { getTrackById } = useTrackService()
  const { getProgramById } = useProgramService()
  const { getAssigns } = useAssignService()
  const { getCourses } = useCourseService()

  const [modules, setModules] = useState<FormationModuleRow[]>([])
  const [formationName, setFormationName] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const fetchModules = useCallback(async () => {
    setIsLoading(true)
    try {
      const track = await getTrackById(formationId).catch(() => null)
      const program = track?.programId
        ? await getProgramById(track.programId).catch(() => null)
        : null

      setFormationName(track?.name ?? '')

      const [allAssigns, allCourses] = await Promise.all([
        getAssigns().catch(() => [] as AssignResponse[]),
        getCourses().catch(() => [] as CourseResponse[]),
      ])

      const courseMap = new Map(allCourses.map((c) => [c.id, c]))
      const filiereLabel = program?.name ?? '—'

      const rows: FormationModuleRow[] = allAssigns
        .filter((a) => a.trackId === formationId)
        .map((a) => {
          const course = courseMap.get(a.courseId)
          return {
            id: `${a.trackId}_${a.courseId}`,
            name: course?.name ?? '—',
            code: course?.code ?? '—',
            hourlyVolume: a.hourlyVolume,
            filiereName: filiereLabel,
          }
        })

      setModules(rows)
    } catch {
      setModules([])
    } finally {
      setIsLoading(false)
    }
  }, [formationId, getTrackById, getProgramById, getAssigns, getCourses])

  useEffect(() => {
    fetchModules()
  }, [fetchModules])

  return { modules, formationName, isLoading, refetch: fetchModules }
}
