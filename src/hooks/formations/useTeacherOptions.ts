import { useState, useEffect } from 'react'
import { type SelectOption } from '@/types/formation'
import { useTeacherService } from '@/services/teacherService'

export function useTeacherOptions() {
  const { getTeachers } = useTeacherService()
  const [options, setOptions] = useState<SelectOption[]>([])

  useEffect(() => {
    getTeachers()
      .then((teachers) => {
        setOptions(
          teachers.map((t) => ({
            value: t.id,
            label: `${t.firstName} ${t.lastName}`,
          })),
        )
      })
      .catch(() => {
        setOptions([])
      })
  }, [getTeachers])

  return options
}
